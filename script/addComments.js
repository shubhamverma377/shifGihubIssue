const { Octokit } = require('octokit');
import { commentMap } from '../mapping/commentMapping';

const fetch = require('node-fetch');
const fs = require('fs');
const { addCommit, createIssueFile } = require('../octokit/createIssue');

const MAP_ISSUE_REPOSITORY = 'issues';
const COMMENT_REPOSITORY = 'Comments';
const REPOSITORY = 'repoA';
const repoName = 'repoB';
const GITHUB_PERSONAL_TOKEN = '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';
const INSERT_COMMENT_REPOSITORY = 'InserComment';

const octokit = new Octokit({
  auth: GITHUB_PERSONAL_TOKEN,
});

const gitLabToken = '';

const addCommit = async (commentData, issuesMappingData, tempIndex) => {
  const indexOfIssues = issuesMappingData.findIndex((data) => {
    return data.Old == commentData[0].noteable_iid;
  });

  try {
    const commentResponseArray = [];
    // tempIndex += 50;
    // console.log('tempIndex-=-=-=-=>', tempIndex);
    const indexOfIssues = issuesMappingData.findIndex((data) => {
      return data.Old == commentData[0].noteable_iid;
    });

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

    for (let index = 0; index < commentResponseArray.length; index++) {
      const commentResponse = await octokit.request(
        'POST /repos/{owner}/{repo}/issues/{issue_number}/comments',
        {
          owner: repoName,
          repo: REPOSITORY,
          issue_number: issuesMappingData[indexOfIssues].New,
          body: commentResponseArray[index],
        }
      );
    }

    return {
      comment: commentResponseArray,
      commentInsertDetails: issuesMappingData[indexOfIssues],
    };
  } catch (error) {
    console.log('error-=-=-=-=>', issuesMappingData[indexOfIssues]);
    error.commentInsertDetails = issuesMappingData[indexOfIssues];
    throw Error(error);
  }
};

const addCommentsFromIssue = async () => {
  const fileListArray = [];
  let issuesMappingData;
  const commentInsertDataArray = [];

  fs.readdirSync(`${COMMENT_REPOSITORY}`).forEach((file) => {
    fileListArray.push(file);
  });

  const issuesFileIndex = 1; // issuesFileListArray length
  const getFileNameIndex = fileListArray[issuesFileIndex].replace(/^\D+/g, '');

  console.log('getFileNameIndex-=-=-=-=>', getFileNameIndex);
  console.log(
    'getIssueFileName-=-=-=-=>',
    `${MAP_ISSUE_REPOSITORY}/Issues_${getFileNameIndex}`
  );

  try {
    fs.readFile(
      `${MAP_ISSUE_REPOSITORY}/Issues_${getFileNameIndex}`,
      'utf8',
      async (err, data) => {
        issuesMappingData = JSON.parse(data);
      }
    );

    fs.readFile(
      `${COMMENT_REPOSITORY}/${fileListArray[issuesFileIndex]}`,
      'utf8',
      async (err, data) => {
        if (err) console.log(err);

        const commentData = JSON.parse(data);

        for (let index = 0; index < commentData.length; index++) {
          console.log('readFil == index-=-=-=>', index);
          const commentInsertData = await addCommit(
            commentData[index],
            issuesMappingData,
            index
          );
          console.log('commentInsertData-=-=>', commentInsertData);
          commentInsertDataArray.push(commentInsertData.commentInsertDetails);
          break;
        }
        await createIssueFile(
          commentInsertDataArray,
          getFileNameIndex,
          'commentInsert',
          INSERT_COMMENT_REPOSITORY
        );

        res.json({ issueDetails: commentInsertDataArray });
      }
    );
  } catch (error) {
    console.log('error-=-=-=>');
    await createIssueFile(
      commentInsertDataArray,
      getFileNameIndex,
      'commentInsert',
      INSERT_COMMENT_REPOSITORY
    );
    res.json({ issueDetails: error.commentInsertDataArray });
  }
};

addCommentsFromIssue();
