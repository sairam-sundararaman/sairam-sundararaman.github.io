// All site content lives here. Edit, push to main, the site redeploys.
export type Link = { label: string; href: string }

export const profile = {
  name: 'Sairam Sundararaman',
  short: 'Sairam S',
  role: 'Research intern, WSAI, IIT Madras',
  tagline: 'I study privacy and robustness in machine learning, from first principles.',
  blurb:
    "I'm a research intern at WSAI, IIT Madras, advised by [Prof. Krishna Pillutla](https://krishnap25.github.io/). I work on differentially private mechanisms for language models and on understanding why ML methods fail. I'm also in the final year of my B.Tech at PES University.",
  bio: [
    "The thread through my work is failure: take a method people rely on, then work out exactly when and why it breaks. My TMLR paper does that for the R-learner in network causal inference, my SAM reproduction does it for a popular optimizer, and the bit-collapse project does it for post-training quantization.",
    "I build things from scratch before trusting a library: an autodiff engine, SAM, a Hessian tool for loss landscapes. Right now I'm applying the same habit to privacy at WSAI, deriving the noise calibration for a new DP mechanism myself instead of treating it as a recipe.",
  ],
  email: 'sairam.sundararaman2005@gmail.com',
  resume: '/resume.pdf',
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sairam-s-22062027s/' },
    { label: 'GitHub', href: 'https://github.com/sairam-sundararaman' },
    { label: 'Scholar', href: 'https://scholar.google.com/citations?user=FFQdp-YAAAAJ' },
    { label: 'ORCID', href: 'https://orcid.org/0009-0000-6320-720X' },
  ] as Link[],
}

export const publication = {
  title: 'The Final-Stage Bottleneck: A Systematic Dissection of the R-Learner for Network Causal Inference',
  authors: ['Sairam S', 'Sara Girdhar', 'Shivam Soni'],
  venue: 'Transactions on Machine Learning Research (TMLR)',
  year: '2026',
  links: [
    { label: 'arXiv', href: 'https://arxiv.org/abs/2511.13018' },
    { label: 'Code', href: 'https://github.com/sairam-sundararaman/final-stage-bottleneck' },
    { label: 'W&B', href: 'https://wandb.ai/pesu-ai-ml/final-stage-bottleneck/' },
    { label: 'OpenReview', href: 'https://openreview.net/forum?id=QIE0FVSn0p' },
  ] as Link[],
}

export const research = {
  title: 'Differentially private mechanisms for transformer LLMs',
  where: 'WSAI, IIT Madras · Advisor: [Prof. Krishna Pillutla](https://krishnap25.github.io/)',
  when: 'June 2026 – present',
  points: [
    'Designing a new DP mechanism for transformers, aiming for a better privacy-utility tradeoff than DP-SGD baselines.',
    'Deriving sensitivity bounds and Gaussian noise calibration from scratch, and composing privacy across layers and generated tokens with zCDP.',
    'Benchmarking on distilgpt2 and Qwen2.5-7B-Instruct.',
  ],
  interests: ['Differential privacy', 'Robustness', 'Adversarial ML'],
}

export const projects: { title: string; when: string; summary: string; links: Link[] }[] = [
  {
    title: 'The Geometry of Bit-Collapse',
    when: "Winter '26",
    summary:
      "Int8 quantization sharpens ResNet-18's loss basin and spikes its Hessian eigenvalues, destabilizing SGD. SAM restores a basin flatter than full precision.",
    links: [{ label: 'GitHub', href: 'https://github.com/sairam-sundararaman/bit-collapse-geometry' }],
  },
  {
    title: 'Reproducing SAM',
    when: "Fall '25",
    summary:
      "Clean-room SAM reaching ~96% on CIFAR-10 against the paper's ~97%. It exposed two weak spots: SAM leans on weight decay without accounting for it, and its approximation degrades at sharp minima.",
    links: [
      { label: 'GitHub', href: 'https://github.com/sairam-sundararaman/sam-optimizer' },
      { label: 'W&B', href: 'https://wandb.ai/pesu-ai-ml/sam-replication-cifar10' },
    ],
  },
  {
    title: 'Optimization Pathologies',
    when: "Fall '25",
    summary:
      'Maps 2D loss landscapes (Rosenbrock, Beale) to show why SGD zigzags in narrow valleys and how momentum smooths the path.',
    links: [{ label: 'GitHub', href: 'https://github.com/sairam-sundararaman/loss-landscape-calculus' }],
  },
  {
    title: 'Reverse-Mode AutoDiff Engine',
    when: "Summer '25",
    summary: 'A scalar autograd engine built from scratch. It matches PyTorch to within 1e-6.',
    links: [{ label: 'GitHub', href: 'https://github.com/sairam-sundararaman/micrograd' }],
  },
]

export const about = {
  education: { school: 'PES University', degree: 'B.Tech, Computer Science & Engineering (AI & ML)', years: '2023 – 2027' },
  honors: [
    { t: 'Dr. MR Doreswamy Merit Scholarship', y: '2024' },
    { t: 'CN Rao Merit Scholarship', y: '2024' },
  ],
  teaching: { t: 'Teaching Assistant, Mathematics for Computer Science, PES University', y: '2025' },
}

export const news: { date: string; text: string }[] = [
  { date: 'Jun 2026', text: 'Started as a Research Intern at WSAI, IIT Madras.' },
  { date: 'Mar 2026', text: 'The Final-Stage Bottleneck [accepted at TMLR](https://openreview.net/forum?id=QIE0FVSn0p).' },
  { date: 'Aug 2025', text: 'Teaching Assistant for Mathematics for Computer Science at PES University.' },
]
