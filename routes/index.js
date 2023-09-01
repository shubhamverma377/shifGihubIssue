import express from 'express';
import { addCommit, createIssueFile } from '../octokit/createIssue';
const { Octokit } = require('octokit');

import fs from 'fs';
import { commentFileMApping } from '../mapping/commentMapping';
import { readFiles } from '../script/readIssueFiles';
import { milestoneList } from './createMilestone';
import { oldLabels } from './lableMapping';

const octokit = new Octokit({
  auth: process.env.GITHUB_PERSONAL_TOKEN,
});

const ownerName = process.env.ORG_NAME;

const router = express.Router();

router

  .post('/milestones', async (req, res) => {
    let milestoneId = [];
    for (let index = 0; index < milestoneList.length; index++) {
      const currentMilestone = milestoneList[index];
      await octokit.rest.issues
        .createMilestone({
          owner: process.env.ORG_NAME,
          repo: process.env.REPOSITORY,
          title: currentMilestone,
          state: 'open',
          // description: 'Tracking milestone for version 1.0',
          // due_on: '2025-10-09T23:39:01Z',
        })
        .then(({ data }) => {
          console.log(`Create Milestone --> ${data.number}`);
          const msData = { [currentMilestone]: data.number };
          milestoneId.push(msData);
        })
        .catch((err) => {
          console.log(`Create milestone error  --> ${err}`);
        });
    }
    await createIssueFile(
      milestoneId,
      '0.js',
      'Milestone',
      process.env.MILESTONE_REPOSITORY
    );
  })

  .post('/updtaeIssues', async (req, res) => {
    const updtaeIssue = {
      owner: 'Aptus-Technologies',
      repo: 'Pointing-Fish-Management',
      issue_number: 192,
      state: 'closed',
    };

    const getUpdateIssue = await octokit.request(
      'PATCH /repos/{owner}/{repo}/issues/{issue_number}',
      updtaeIssue
    );

    return res.send({ issueDetails: getUpdateIssue });
  })

  // .post('/updtaeLabels', async (req, res) => {
  //   const updtaeIssue = {
  //     owner: 'Aptus-Technologies',
  //     repo: 'Pointing-Fish-Management',
  //     issue_number: 192,
  //     state: 'closed',
  //   };

  //   await octokit.request(
  //     'PATCH /repos/{owner}/{repo}/labels/{name}',
  //     updtaeIssue
  //   );

  //   return res.send({ issueDetails: getUpdateIssue });
  // })

  .post('/createIssue', async (req, res) => {
    const issueList = [];
    const issuesFileIndex = process.env.ISSUE_INDEX_FILE; // issuesFileListArray length
    const issuesFileListArray = await readFiles(process.env.REPOSITORY);
    const getFileNameIndex = issuesFileListArray[issuesFileIndex].replace(
      /^\D+/g,
      ''
    );
    try {
      console.log(
        `Issue File ----------> ${process.env.USER_NAME} -- ${issuesFileListArray.length} -- ${issuesFileListArray[issuesFileIndex]}`
      );
      let issueData = require(`../${process.env.REPOSITORY}/${issuesFileListArray[issuesFileIndex]}`);
      const newIssueData = issueData.issueData;

      console.log('newIssueData-=-=-=>', newIssueData.length);

      for (let index = 53; index < newIssueData.length; index++) {
        let issueRes;
        issueRes = await createIssue(newIssueData[index], index);
        issueList.push(issueRes);
      }

      await createIssueFile(
        issueList,
        getFileNameIndex,
        'issues',
        process.env.MAP_ISSUE_REPOSITORY
      );
      return res.send({ issue: issueList });
      // return res.send({ issue: issueData });
    } catch (err) {
      console.log(`Create Issue Error -->`, err);
      await createIssueFile(
        issueList,
        getFileNameIndex,
        'issues',
        process.env.MAP_ISSUE_REPOSITORY
      );
      return res.send({ issue: issueList });
    }
  })

  .get('/userList', async (req, res) => {
    const {
      data: { login },
    } = await octokit.rest.users.getAuthenticated();
    console.log('Hello, %s', login);
    res.json({ message: 'Get Users', data: login });
  })

  .get('/orgList', async (req, res) => {
    const orgList = await octokit.request('GET /orgs/{org}', {
      org: process.env.ORG_NAME,
    });
    console.log('Org List -->', orgList);
    res.json({ message: 'Nextgen api server is healthy' });
  })

  .get('/repos', async (req, res) => {
    const repoRes = await octokit.request('GET /orgs/{org}/repos', {
      org: process.env.ORG_NAME,
    });
    console.log('Repository List -->', repoRes);
    res.json({ repo: repoRes });
  })

  .get('/teams', async (req, res) => {
    const repoTeam = await octokit.request('GET /repos/{owner}/{repo}/teams', {
      owner: ownerName,
      repo: 'Esign_demo',
    });
    console.log(`Team List --->`, repoTeam);
    res.json({ teams: repoTeam });
  })

  .post('/addCommit', async (req, res) => {
    const commentInsertDataArray = [];  
    const issuesFileListArray = await readFiles(process.env.COMMENT_REPOSITORY);

    const issuesFileIndex = 7;

    const getFileNameIndex = issuesFileListArray[issuesFileIndex].replace(
      /^\D+/g,
      ''
    );

    console.log("getFileNameIndex",getFileNameIndex)
    try {
      let issuesFileName;
      let issuesMappingData;

      commentFileMApping.find((data) => {
        issuesFileName = data[`${issuesFileListArray[issuesFileIndex]}`];
      });

      fs.readFile(
        `${process.env.MAP_ISSUE_REPOSITORY}/${issuesFileName}`,
        'utf8',
        async (err, data) => {
          issuesMappingData = JSON.parse(data);
        }
      );

      const getFileNameIndex = issuesFileListArray[issuesFileIndex].replace(
        /^\D+/g,
        ''
      );

      console.log('filename index-=-=-=-=>', getFileNameIndex);

      fs.readFile(
        `${process.env.COMMENT_REPOSITORY}/${issuesFileListArray[issuesFileIndex]}`,
        'utf8',
        async (err, data) => {
          const commentData = JSON.parse(data);
          // for (let index = 1; index <= 0; index++) {
          for (let index =77; index < commentData.length; index++) {
            console.log('readFile == index-=-=-=>', index);
            const commentInsertData = await addCommit(
              commentData[index],
              issuesMappingData,
              index
            );
            console.log('commentInsertData-=-=>', commentInsertData.length);
            commentInsertDataArray.push(commentInsertData.commentInsertDetails);
            //break;
          }
          await createIssueFile(
            commentInsertDataArray,
            getFileNameIndex,
            'commentInsert',
            process.env.INSERT_COMMENT_REPOSITORY
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
        process.env.INSERT_COMMENT_REPOSITORY
      );
      res.json({ issueDetails: error.commentInsertDataArray });
    }
  })

  .post('/createLabel', async (req, res) => {
    for (let index = 0; index < oldLabels.length; index++) {
      console.log(`Labels --->`, oldLabels[index]);
      await octokit.request('POST /repos/{owner}/{repo}/labels', {
        owner: ownerName,
        repo: process.env.REPOSITORY,
        name: oldLabels[index],
        color: Math.floor(Math.random() * 16777215).toString(16),
      });
      console.log(oldLabels[index]);
    }
    res.json({ message: 'Labels Created Successfully' });
  });

export default router;
