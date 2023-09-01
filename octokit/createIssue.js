const { Octokit } = require('octokit');
const fetch = require('node-fetch');

import fs from 'fs';

import { commentMap } from '../mapping/commentMapping';
import { descriptionMap } from '../mapping/descriptionMapping';
import { userMap } from '../mapping/userMapping';

const octokit = new Octokit({
  auth: process.env.GITHUB_PERSONAL_TOKEN,
});

const repoName = process.env.ORG_NAME;

export const createIssue = async (issueElement, index, issuesFileIndex) => {
  let milestoneData = null;
  let newIssues = {};
  const desciptionData = descriptionMap(issueElement);

  // if (issueElement.milestone) {
  //   if (issueElement.milestone.title !== null) {
  //     milestoneData = milestoneMap(issueElement.milestone.title);
  //   }
  // }

  let userData = null;
  if (issueElement.assignee && issueElement.assignee.username) {
    userData = userMap(issueElement.assignee.username);
  }
  // console.log(`User data --> ${userData}`)
  // const userData = issueElement.assignee && issueElement.assignee.username
  //     ? userMap(issueElement.assignee.username) : null;

  // console.log(`Labels ===>`, issueElement.labels);
  // console.log(`Ownername ===>`, ownerName);
  // console.log(`Description =====>`, desciptionData);
  // console.log(`Milestone ======>`, typeof milestoneData);
  // console.log(`User Data ==>`, userData);

  let issueData;

  if (milestoneData && userData) {
    console.log('11111 -->', index, '--', issueElement.iid);

    newIssues = {
      owner: repoName,
      repo: process.env.REPOSITORY,
      title: issueElement.title,
      body: desciptionData,
      assignees: [userData],
      milestone: milestoneData,
      labels: issueElement.labels,
    };
  } else if (userData !== null && milestoneData == null) {
    console.log('22222 ---->', index, '--', issueElement.iid);

    newIssues = {
      owner: repoName,
      repo: process.env.REPOSITORY,
      title: issueElement.title,
      body: desciptionData,
      assignees: [userData],
      labels: issueElement.labels,
    };
  } else if (userData == null && milestoneData !== null) {
    console.log('33333 --->', index, '--', issueElement.iid);

    newIssues = {
      owner: repoName,
      repo: process.env.REPOSITORY,
      title: issueElement.title,
      body: desciptionData,
      milestone: milestoneData,
      labels: issueElement.labels,
    };
  } else if (userData == null && milestoneData === null) {
    console.log('44444 --->', index, '--', issueElement.iid);

    newIssues = {
      owner: repoName,
      repo: process.env.REPOSITORY,
      title: issueElement.title,
      body: desciptionData,
      labels: issueElement.labels,
    };
  }

  // newIssues.milestone = 55;
  console.log(`Repo --> ${process.env.REPOSITORY}`);
  issueData = await octokit.request(
    'POST /repos/{owner}/{repo}/issues',
    newIssues
  );

  console.log(
    `Final =====> Index-- ${index} --Old-- ${issueElement.iid} --New-- ${issueData.data.number} `
  );

  const newIssueData = {
    index,
    Old: issueElement.iid,
    New: issueData.data.number,
  };

  // await createIssueFile(newIssueData, issuesFileIndex, "issues");
  return newIssueData;
};

export const addCommit = async (commentData, issuesMappingData, tempIndex) => {
  const indexOfIssues = issuesMappingData.findIndex((data) => {
    return data.Old == commentData[0].noteable_iid;
  });

  try {
   const commentResponseArray = [];
    // tempIndex += 50;
    // console.log('tempIndex-=-=-=-=>', tempIndex);
    // const indexOfIssues = issuesMappingData.findIndex((data) => {
    //   return data.Old == commentData[0].noteable_iid;
    // });

    console.log(
      'GitHub issueNumber-=-=-=>',
      issuesMappingData[indexOfIssues].New
    );


    for (let comIndex = commentData.length - 1; comIndex >= 0; comIndex--) {
      const commentBody = commentMap(commentData[comIndex]);

      Object.keys(commentBody).length > 0
        ? commentResponseArray.push(commentBody)
        : '';
    }


    console.log('-=-=-=-=-=-=-=-=-=-=>', commentResponseArray.length);

    for (let index =0; index < commentResponseArray.length; index++) {
      const commentResponse = await octokit.request(
        'POST /repos/{owner}/{repo}/issues/{issue_number}/comments',
        {
          owner: repoName,
          repo: process.env.REPOSITORY,
           issue_number: issuesMappingData[indexOfIssues].New,
         // issue_number: 1548, 
          body: commentResponseArray[index],
        }
      );
    }

    return {
      comment: commentResponseArray,
      commentInsertDetails: issuesMappingData[indexOfIssues],
    };
  } catch (error) {
    console.log(issuesMappingData[indexOfIssues]);
    error.commentInsertDetails = issuesMappingData[indexOfIssues];
    throw Error(error);
  }
};

export const getCommitList = async (issueId, getFileNameIndex) => {
  console.log(`-----> Old Issue Id --> ${issueId}`);
  const getIssueComment = `https://gitlab.com/api/v4/projects/${process.env.GIT_LAB_PROJECT_ID}/issues/${issueId}/notes?per_page=100&page=1`;
  fetch(getIssueComment, {
    method: 'GET',
    headers: {
      'PRIVATE-TOKEN': process.env.GITLAB_TOKEN,
      'Content-Type': 'application/json',
    },
  })
    .then(async (response) => {
      return response.json();
    })
    .then(async (issuesCommentsData) => {
      console.log(
        `Old Issue --> ${issueId} --length--> ${issuesCommentsData.length}`
      );

      const repoResponse = await createIssueFile(
        issuesCommentsData,
        getFileNameIndex,
        'comments',
        process.env.COMMENT_REPOSITORY
      );

      console.log('repoResponse-=-=-=>', repoResponse);
      return true;
    })
    .catch((error) => {
      console.log(`Pipeline Submit --> ${error}`);
      throw error;
    });
};

export const createIssueFile = async (
  newIssueData,
  issuesFileIndex,
  fileName,
  repoName
) => {
  console.log('Repo creadted ==>');

  if (!fs.existsSync(repoName)) {
    fs.mkdirSync(`${repoName}`);
    fs.writeFileSync(
      `${repoName}/${fileName}_${issuesFileIndex}`,
      `${JSON.stringify(newIssueData)},`,
      { flag: 'a', encoding: 'utf-8' },
      (err) => {
        console.log('err-=-=-1111=>', err);
        if (err) throw err;
        console.log(
          `${repoName}/${repoName}_${issuesFileIndex}.js ==> File created successfully`
        );
      }
    );
  } else {
    fs.writeFileSync(
      `${repoName}/${fileName}_${issuesFileIndex}`,
      `${JSON.stringify(newIssueData)},`,
      { flag: 'a', encoding: 'utf-8' },
      (err) => {
        console.log('err-=-=-222=>', err);
        if (err) throw err;
        console.log(
          `${repoName}/${repoName}_${issuesFileIndex}.js --> File created successfully`
        );
      }
    );
  }

  return true;
};

export const addCommitBackUp = async (commentData, issuesMappingData) => {
  let commentResponse = [];
  for (let comIndex = commentData.length - 1; comIndex >= 0; comIndex--) {
    const commentBody = commentMap(commentData[comIndex]);

    Object.keys(commentBody).length > 0
      ? commentResponse.push({ commentRes: commentBody })
      : '';

    await octokit.request(
      'POST /repos/{owner}/{repo}/issues/{issue_number}/comments',
      {
        owner: repoName,
        repo: process.env.REPOSITORY,
        issue_number: issueNumber,
        body: commentBody,
      }
    );
  }

  return { comment: commentResponse };
};
