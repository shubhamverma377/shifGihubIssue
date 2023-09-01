import { getCommitList } from '../octokit/createIssue';
import { userMap } from './userMapping';

export const commentFileMApping = [
  {
    'comments_2.js': 'Issues_2.js',
    'comments_3.js': 'Issues_3.js',
    'comments_4.js': 'Issues_4.js',
    'comments_5.js': 'Issues_5.js',
    'comments_6.js': 'Issues_6.js',
    'comments_7.js': 'Issues_7.js',
    'comments_8.js': 'Issues_8.js',
    'comments_9.js': 'Issues_9.js',
    'comments_10.js': 'Issues_10.js',
    'comments_11.js': 'Issues_11.js',
    'comments_12.js': 'Issues_12.js',
    'comments_13.js': 'Issues_13.js',
    'comments_14.js': 'Issues_14.js',
    'comments_15.js': 'Issues_15.js',
    'comments_16.js': 'Issues_16.js',
    'comments_17.js': 'Issues_17.js',
    'comments_18.js': 'Issues_18.js',
    'comments_19.js': 'Issues_19.js',
    'comments_20.js': 'Issues_20.js',
    'comments_21.js': 'Issues_21.js',
    'comments_22.js': 'Issues_22.js',
    'comments_23.js': 'Issues_23.js',
    'comments_24.js': 'Issues_24.js',
    'comments_25.js': 'Issues_25.js',
    'comments_26.js': 'Issues_26.js',
  },
];

export const commentMap = (commentRes) => {
  // console.log(commentRes);

  const author = `AUTHOR:`;
  const message = `MESSAGE:`;
  const estimate = `ESTIMATE:`;
  const spent = `SPENT:`;
  const assignedTo = `Assigned To:`;
  const createdAt = `Created At:`;

  const authorName = userMap(commentRes.author.username);
  const newAuthorName = authorName.includes('null')
    ? authorName.split('null-')[1]
    : `@${authorName}`;

  // Mention in issue
  // Change the description
  if (
    commentRes.body.includes('changed the description') ||
    commentRes.body.includes('marked this issue as related to') ||
    commentRes.body.includes('mentioned in merge request')
  ) {
    // console.log(`Comment response 11111 --> `);
    return {};
  } else if (commentRes.body.includes('assigned to')) {
    //Assigned To
    // console.log(`Comment response 22222 --> `);
    return `${author.bold()} ${newAuthorName} <br> ${createdAt.bold()} ${
      commentRes.created_at
    }<br>${assignedTo.bold()} ${commentRes.body}`;
  } else if (commentRes.body.includes('changed time estimate to')) {
    // Estimate
    // console.log(`Comment response 33333 --> `);
    const estimateTime = commentRes.body.split('changed time estimate to');
    console.log(`Estimate Time --> ${estimateTime[1]}`);
    return `${author.bold()} ${newAuthorName}  <br> ${createdAt.bold()} ${
      commentRes.created_at
    }<br>${estimate.bold()} ${estimateTime[1]}`;
  } else if (commentRes.body.includes('of time spent')) {
    // Spent
    // console.log(`Comment response 44444 --> `);
    const spentTime = commentRes.body.split('of time spent');
    // console.log(`Spent Time --> ${spentTime[0]}`);
    return `${author.bold()} ${newAuthorName} <br> ${createdAt.bold()} ${
      commentRes.created_at
    }<br>${spent.bold()} ${spentTime[0]}`;
  } else {
    // console.log(`Comment response 55555--> `);
    return `${author.bold()} ${newAuthorName} <br> ${createdAt.bold()} ${
      commentRes.created_at
    }<br>${message.bold()} ${commentRes.body}`;
  }
};
