export const descriptionMap = (issueElement) => {
  // console.log(`issue ele -->`, issueElement.description);
  const author = `AUTHOR:`;
  const spent = `SPENT:`;
  const estimate = `ESTIMATE:`;
  const description = `DESCRIPTION:`;
  const createdAt = `CREATEDAT:`;
  const newCreated = `${createdAt.bold()} ${issueElement.created_at}`;
  const newAuthor = `${author.bold()} ${issueElement.author.username}`;
  const newSpent = `${spent.bold()} ${
    issueElement.time_stats.human_total_time_spent
  }`;

  const newEstimate = `${estimate.bold()} ${
    issueElement.time_stats.human_time_estimate
  }`;

  return `${newAuthor}  <br>
      ${newCreated} <br>
      ${newSpent}  <br>
      ${newEstimate} <br>
      ${description.bold()} ${issueElement.description} <br>`;
};
