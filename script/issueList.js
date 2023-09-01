const fetch = require('node-fetch');
const fs = require('fs');

const milestoneArray = [1, 2, 3];

const dir = 'TimeSheet'; //gitlab orgName;
const gitlabRepoName = 'timesheet'; //gitlab projectName;
const projectId = 33509861; //gitlab projectId
const gitLabToken = ''


const pipelineSubmitApi = async () => {
  for (let index = 0; index < 2 /* milestoneArray.length */; index++) {
    console.log('Index -->', index);
    const gitlabAPI = `https://gitlab.com/api/v4/projects/${projectId}/issues?per_page=100&page=${milestoneArray[index]}`;
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

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
          fs.writeFile(
            `${dir}/${gitlabRepoName}${milestoneArray[index]}.js`,
            `export const issueData = ${JSON.stringify(issuesData)}`,
            { flag: 'a', encoding: 'utf-8' },
            (err) => {
              if (err) throw err;
              console.log('Issues created successfully (file).');
            }
          );
        } else {
          fs.writeFile(
            `${dir}/${gitlabRepoName}${milestoneArray[index]}.js`,
            `export const issueData = ${JSON.stringify(issuesData)}`,
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
  }
};

pipelineSubmitApi();
