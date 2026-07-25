export type SampleBrief = {
  goalLabel: string;
  title: string;
  campaignGoal: string;
  creatorTier: string;
  totalBudget: string;
  creatorNiche: string;
  platforms: string;
  brief: string;
  contentAssetLink?: string;
  deliverables: string[];
  contentDirection: string[];
  dos: string[];
  donts: string[];
};

export const sampleBriefs: Record<'create' | 'amplify', SampleBrief> = {
  create: {
    goalLabel: 'Create Content',
    title: 'Sprintwave Savings Challenge',
    campaignGoal: 'Content Creation',
    creatorTier: 'Nano (1k–10k) ₦50k–₦150k, Micro (10k–200k) ₦150k–₦500k',
    totalBudget: '₦800,000',
    creatorNiche: 'Personal Finance, Lifestyle',
    platforms: 'Instagram, TikTok',
    brief:
      'Sprintwave is a savings and investment app built for young Nigerians who want to build better money habits without complicated jargon. We want creators to show how they actually use the app themselves, whether that is setting up a savings goal, tracking progress, or explaining why they switched to it. This should feel like a real recommendation from someone who uses it, not a scripted ad read.',
    deliverables: ['One Instagram Reel, 30 to 45 seconds', 'One TikTok video, 30 to 60 seconds'],
    contentDirection: [
      'Show the app actually open on screen, not just mentioned in passing',
      'Screen record yourself opening the app and navigating to one specific feature, for example a savings goal, auto save, or the investment tracker',
      'Explain in your own words why you use that feature',
      'Share one honest tip or habit that has worked for you',
      'Keep the tone conversational, like advice to a friend, not a sales pitch',
    ],
    dos: [
      'Show the app interface clearly on screen at least once',
      'Mention that Sprintwave is available on the Play Store and App Store',
      'Tag @SprintwaveNG',
      'Use the hashtag #SaveWithSprintwave',
    ],
    donts: [
      'Do not guarantee specific investment returns or promise guaranteed profit',
      'Do not compare directly to a competitor app by name',
      'Do not show your own account balance or personal financial details on screen',
    ],
  },
  amplify: {
    goalLabel: 'Amplify Content',
    title: 'Sprintwave Auto Save Feature Amplification',
    campaignGoal: 'Content Amplification',
    creatorTier: 'Nano (1k–10k) ₦50k–₦150k, Micro (10k–200k) ₦150k–₦500k',
    totalBudget: '₦1,200,000',
    creatorNiche: 'Personal Finance, Tech',
    platforms: 'Instagram, TikTok',
    brief:
      'We already have a professionally produced 30 second video introducing our new Auto Save feature, and we want creators to help it reach a wider audience by posting it to their own page. This is not a content creation campaign. We are not asking you to make anything new, just to share what we have already made with your audience.',
    contentAssetLink: 'A Google Drive link of the video that creators can download and amplify.',
    deliverables: [
      'Post the provided video to your Instagram Reels',
      'Post the same video to your TikTok',
    ],
    contentDirection: ['Do not trim, edit, or add your own voiceover to the video'],
    dos: ['Must tag @SprintwaveNG', 'Must use the hashtag #SprintwaveAutoSave'],
    donts: [],
  },
};
