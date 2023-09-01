const fetch = require('node-fetch');
const fs = require('fs');

const commentDir = 'Comments11'; //gitlab orgName;
const dir = 'issues'; //gitlab orgName;
const gitlabRepoName = 'comments'; //gitlab projectName;
// const projectId = 19022494; //gitlab projectId
const gitLabToken = '';

const pipelineSubmitApi = async (
  issueId,
  GIT_LAB_PROJECT_ID,
  getFileNameIndex
) => {
  const gitlabAPI = `https://gitlab.com/api/v4/projects/${GIT_LAB_PROJECT_ID}/issues/${issueId}/notes?per_page=100&page=1`;
  fetch(gitlabAPI, {
    method: 'GET',
    headers: {
      'PRIVATE-TOKEN': gitLabToken,
      'Content-Type': 'application/json',
    },
  })
    .then(async (response) => {
      return response.json();
    })
    .then((issuesData) => {
      console.log(
        `Issue Length for ${gitlabRepoName} ---->`,
        issuesData.length
      );

      if (!fs.existsSync(commentDir)) {
        fs.mkdirSync(commentDir);
        fs.writeFile(
          `${commentDir}/${gitlabRepoName}_${getFileNameIndex}`,
          `${JSON.stringify(issuesData)},`,
          { flag: 'a', encoding: 'utf-8' },
          (err) => {
            if (err) throw err;
            console.log('Issues created successfully (file).');
          }
        );
      } else {
        fs.writeFile(
          `${commentDir}/${gitlabRepoName}_${getFileNameIndex}`,
          `${JSON.stringify(issuesData)},`,
          { flag: 'a', encoding: 'utf-8' },
          (err) => {
            if (err) throw err;
            console.log(`Issues created successfully.`);
          }
        );
      }
    })
    .catch((error) => {
      console.log(`Pipeline Submit --> ${error}`);
      throw error;
    });
};

const getCommentFromIssue = async () => {
  const fileListArray = [];
  fs.readdirSync(`${dir}`).forEach((file) => {
    fileListArray.push(file);
  });

  // console.log(fileListArray[9]);
  const issuesFileIndex = 0; // issuesFileListArray length
  const getFileNameIndex = fileListArray[issuesFileIndex].replace(/^\D+/g, '');
  console.log('getFileNameIndex-=-=>', getFileNameIndex);
  // fs.readFile(
  //   `${dir}/${fileListArray[issuesFileIndex]}`,
  //   'utf8',
  //   async (err, data) => {
  //     const commentsIssue = JSON.parse(data);
  //     for (let index = 0; index < commentsIssue.length; index++) {
  //       await pipelineSubmitApi(
  //         commentsIssue[index].Old,
  //         24654534,
  //         getFileNameIndex
  //       );
  //     }
  //     console.log('Over brother.');
  //   }
  // );
};

getCommentFromIssue();
