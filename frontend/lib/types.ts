//frontend equivalent of backend's schemas 
//these define the structure of how each request should be 
//your components should recieve the correct data in the correct fields. 
//how shd the data from frontend be strutcured for it to go to backend with the correct structure 

export type Sentiment = "positive" | "neutral" | "negative";

export interface Post {
  id: string;
  content: string;
  created_at: string; // ISO string
  upvotes: number;
  downvotes: number;
  sentiment: Sentiment;
}

export interface TrendingTopic {
  tag: string;
  score: number;
  post_count: number;
}

export interface FeedResponse {
  posts: Post[];
  trending: TrendingTopic[];
}
