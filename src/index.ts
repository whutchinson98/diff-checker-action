import { context, getOctokit } from '@actions/github';
import * as core from '@actions/core';

function getCommitShas(): { base: string; head: string } {
  const eventName = context.eventName;

  let base: string;
  let head: string;

  switch (eventName) {
    case 'pull_request':
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      base = context.payload.pull_request?.base?.sha;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      head = context.payload.pull_request?.head?.sha;
      break;
    case 'push':
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      base = context.payload.before;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      head = context.payload.after;
      break;
    default:
      throw new Error(
        `Action does not support ${context.eventName} at this time`,
      );
  }

  if (!base || !head) {
    throw new Error('base or head not set');
  }

  return { base, head };
}

export async function run() {
  try {
    const { base, head } = getCommitShas();
    const diffInput = core.getInput('diff', { required: true });

    const diffMap: { [name: string]: string } = {};

    for (const diff of diffInput.split('\n')) {
      const [key, value] = diff.split(':');
      diffMap[key.trimStart()] = value.trimStart();
    }

    const octokit = getOctokit(core.getInput('token', { required: true }));
    const result = await octokit.rest.repos.compareCommits({
      base,
      head,
      owner: context.repo.owner,
      repo: context.repo.repo,
    });

    if (result.status !== 200) {
      throw new Error(`comparing commits failed with status ${result.status}`);
    }

    const fileNames: string[] = result.data.files?.map(f => f.filename) ?? [];

    if (fileNames.length === 0) {
      for (const key in diffMap) {
        core.setOutput(key, 'false');
      }
    }

    const resultMap: { [name: string]: boolean } = {};
    for (const key in diffMap) {
      const regexPattern = diffMap[key]
        .replace('./', '')
        .replaceAll(/\//g, '\\/')
        .replaceAll(/\./g, '\\.')
        .replaceAll(/\*/g, '.*');
      const regex = new RegExp(`^${regexPattern}$`);
      resultMap[key] = fileNames.some(f => regex.test(f));
    }

    for (const key in resultMap) {
      core.setOutput(key, resultMap[key].toString());
    }
  } catch (error) {
    core.setFailed(error as Error);
  }
}

// Run the action
// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
