import os

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "twogenders")
DB_USER = os.getenv("DB_USER", "abc")
DB_PASSWORD = os.getenv("DB_PASSWORD", "12345") 



BASIC_QUESTIONS = [
    "What is your name?",
    "What is your age?",
    "What is your gender?"
]

BINARY_QUESTIONS = [
  {
    "Original Statement": "I genuinely like who I am, even when I make mistakes.",
    "Rephrased Version": "I'm not perfect, but I'm perfectly me.",
    "Reasoning and Unexpected Insight": "Uses a casual tone to emphasize self-acceptance, inspired by Instagram captions; unexpectedly, humor highlights imperfection as a strength."
  },
  {
    "Original Statement": "Being true to myself matters more than fitting in with others.",
    "Rephrased Version": "I'm not everyone's cup of tea, but I'm someone's shot of whiskey.",
    "Reasoning and Unexpected Insight": "Metaphor from social media shows uniqueness, with an unexpected twist that being different is valued by the right people."
  },
  {
    "Original Statement": "I feel comfortable sharing my fears or insecurities with people I trust.",
    "Rephrased Version": "I'm an open book with my besties.",
    "Reasoning and Unexpected Insight": "Casual term 'besties' makes vulnerability relatable, inspired by friendship quotes; unexpectedly, it feels more inviting."
  },
  {
    "Original Statement": "When criticized, I focus on understanding the feedback rather than defending myself.",
    "Rephrased Version": "I'm all about learning from feedback, not fighting it.",
    "Reasoning and Unexpected Insight": "Emphasizes growth with a casual tone, from criticism quotes; unexpectedly, it frames feedback as a learning opportunity, not a threat."
  },
  {
    "Original Statement": "After an argument, I prioritize repairing the relationship over proving I'm right.",
    "Rephrased Version": "After a fight, I'm all about making up, not making a point.",
    "Reasoning and Unexpected Insight": "Playful contrast highlights reconciliation, from relationship quotes; unexpectedly, it shifts focus to emotional connection over ego."
  },
  {
    "Original Statement": "I find it easy to trust others unless they give me a clear reason not to.",
    "Rephrased Version": "I'm like a puppy: I trust everyone until they hurt me.",
    "Reasoning and Unexpected Insight": "Puppy metaphor adds fun, from trust quotes; unexpectedly, it humanizes trust as natural and forgiving, like a pet's nature."
  },
  {
    "Original Statement": "When someone shares a problem, my first instinct is to listen rather than fix it.",
    "Rephrased Version": "I'm the shoulder to cry on, not the problem solver.",
    "Reasoning and Unexpected Insight": "Casual, supportive tone from listening quotes; unexpectedly, it redefines support as emotional presence, not solutions."
  },
  {
    "Original Statement": "I regularly reflect on how my actions impact my partner's feelings.",
    "Rephrased Version": "I'm my partner's emotional GPS; I always check if my actions are leading them to happy places.",
    "Reasoning and Unexpected Insight": "GPS metaphor adds playfulness, from relationship quotes; unexpectedly, it frames emotional awareness as navigation, making it dynamic."
  },
  {
    "Original Statement": "Compromising in relationships feels like mutual growth, not losing.",
    "Rephrased Version": "Compromise in relationships is like a dance: it takes two to tango.",
    "Reasoning and Unexpected Insight": "Dance metaphor from compromise quotes makes it fun and mutual; unexpectedly, it turns compromise into a collaborative, enjoyable act."
  },
  {
    "Original Statement": "Helping others grow is as important as my own success.",
    "Rephrased Version": "Helping others is my superpower; it makes me feel like a hero.",
    "Reasoning and Unexpected Insight": "Superhero theme from helping quotes adds empowerment; unexpectedly, it elevates altruism to a heroic level, making it inspiring."
  },
  {
    "Original Statement": "Experiencing new cultures challenges and excites me.",
    "Rephrased Version": "New cultures are my playground; I love the excitement of the unknown.",
    "Reasoning and Unexpected Insight": "Playground metaphor from culture quotes adds excitement; unexpectedly, it frames cultural exploration as a fun, adventurous game."
  },
  {
    "Original Statement": "Ethical consistency matters more than situational convenience.",
    "Rephrased Version": "Ethics are my compass; I don't let convenience change my direction.",
    "Reasoning and Unexpected Insight": "Compass metaphor from ethics quotes adds direction; unexpectedly, it makes ethical steadfastness feel like a guided journey, not a burden."
  },
  {
    "Original Statement": "I see disagreements as opportunities to expand my perspective.",
    "Rephrased Version": "I love a good argument; it's like a mental workout.",
    "Reasoning and Unexpected Insight": "Workout metaphor from disagreement quotes adds fun; unexpectedly, it turns debates into exercise for the mind, making them energizing."
  },
  {
    "Original Statement": "Financial stability enables my values; it doesn't define them.",
    "Rephrased Version": "Money is the fuel for my value-driven journey.",
    "Reasoning and Unexpected Insight": "Fuel metaphor from money quotes adds dynamism; unexpectedly, it frames money as a tool, not a dictator, in a casual, empowering way."
  },
  {
    "Original Statement": "Past relationship hurts have taught me more than they limit me.",
    "Rephrased Version": "My past relationship mistakes are my relationship school; I've got a PhD in love.",
    "Reasoning and Unexpected Insight": "School metaphor from relationship hurt quotes adds humor; unexpectedly, it turns pain into a learning credential, making it empowering."
  },
  {
    "Original Statement": "I intentionally create habits that align with my future self's needs.",
    "Rephrased Version": "I'm building my future self one habit at a time.",
    "Reasoning and Unexpected Insight": "Building metaphor from habit quotes adds forward-looking tone; unexpectedly, it frames habit formation as a construction project, engaging and proactive."
  },
  {
    "Original Statement": "Changing my mind when presented with new evidence feels empowering.",
    "Rephrased Version": "New evidence is my superpower; it makes me stronger and smarter.",
    "Reasoning and Unexpected Insight": "Superhero theme from change quotes adds empowerment; unexpectedly, it makes adaptability feel like a heroic trait, fun and inspiring."
  },
  {
    "Original Statement": "Deep conversations energize me more than casual small talk.",
    "Rephrased Version": "Deep talks are my jam; small talk is just white noise.",
    "Reasoning and Unexpected Insight": "Music metaphor from conversation quotes adds fun; unexpectedly, it contrasts depth with noise, making preference feel musical and relatable."
  },
  {
    "Original Statement": "I want a partner who challenges my perspectives respectfully.",
    "Rephrased Version": "My perfect match is someone who's not afraid to rock my boat, but does it with grace.",
    "Reasoning and Unexpected Insight": "Boat metaphor from relationship quotes adds playfulness; unexpectedly, it frames challenges as rocking, but with respect, making it dynamic and fun."
  },
  {
    "Original Statement": "Shared values matter more in relationships than shared interests.",
    "Rephrased Version": "Our shared values are the foundation; our shared interests are the icing on the cake.",
    "Reasoning and Unexpected Insight": "Cake metaphor from relationship quotes adds humor; unexpectedly, it prioritizes values as core, with interests as extras, making it light and memorable."
  }
]

FREE_QUESTIONS = [
  "What makes you excited?",
  "What makes you sad?",
]