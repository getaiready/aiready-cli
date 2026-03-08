import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { Resource } from 'sst';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function getIndustryBenchmarks(repoId: string) {
  // In a production environment, we would use an aggregate table updated by a Lambda.
  // For Alpha/Beta, we scan the table to compute real-time percentiles.
  const command = new ScanCommand({
    TableName: Resource.MainTable.name,
    FilterExpression: 'entityType = :type',
    ExpressionAttributeValues: {
      ':type': 'REPOSITORY',
    },
  });

  const { Items = [] } = await docClient.send(command);
  const scores = Items.map((item) => item.score || 0).sort((a, b) => a - b);

  if (scores.length === 0) return null;

  const currentRepo = Items.find((item) => item.id === repoId);
  const currentScore = currentRepo?.score || 0;

  // Calculate Percentile
  const countBelow = scores.filter((s) => s < currentScore).length;
  const percentile = Math.round((countBelow / scores.length) * 100);
  const average = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  return {
    percentile: 100 - percentile, // "Top 5%" instead of "95th percentile"
    averageScore: average,
    totalRepos: scores.length,
    rank:
      percentile > 90
        ? 'Elite'
        : percentile > 70
          ? 'High'
          : percentile > 40
            ? 'Moderate'
            : 'Needs Improvement',
  };
}
