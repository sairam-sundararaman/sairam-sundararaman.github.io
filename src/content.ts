// All site content lives here. Edit, push to main, the site redeploys.
export type Link = { label: string; href: string }

export const profile = {
  name: 'Sairam Sundararaman',
  short: 'Sairam S',
  role: 'Research intern, WSAI, IIT Madras',
  tagline: 'I study privacy and robustness in machine learning, from first principles.',
  bio: [
    "I'm a research intern at WSAI, IIT Madras, working with [Prof. Krishna Pillutla](https://krishnap25.github.io/). My focus is making language models private without giving up much accuracy: I'm designing a new differentially private mechanism for transformers and working out the math behind it myself.",
    "I'm in the final year of a B.Tech in CSE (AI & ML) at PES University advised by [Prof. Bhaskarjyoti Das](https://staff.pes.edu/nm1700/). I learn by rebuilding things, such as an autodiff engine, SAM, and loss-landscape tools, until I can say exactly where and why they break.",
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
  title: 'Differentially private mechanisms for transformers',
  where: 'WSAI, IIT Madras · Advisor: [Prof. Krishna Pillutla](https://krishnap25.github.io/)',
  when: 'June 2026 – present',
  points: [
    'Designing and analyzing a novel DP mechanism targeting tighter privacy-utility tradeoffs than standard DP-SGD baselines.',
    'Derived sensitivity bounds and Gaussian-mechanism noise calibration from first principles; formalized privacy composition under zCDP across layers and generated tokens.',
    'Implemented and benchmarked on distilgpt2 and Qwen2.5-7B-Instruct.',
  ],
  interests: ['Differential privacy', 'Robustness', 'Adversarial ML'],
}

export const projects: { title: string; when: string; summary: string; links: Link[] }[] = [
  {
    title: 'The Geometry of Bit-Collapse',
    when: "Winter '26",
    summary:
      "Int8 quantization makes ResNet-18's loss basin sharper and spikes its Hessian eigenvalues, which destabilizes SGD. Adding SAM brings the curvature back, to a basin flatter than full precision.",
    links: [{ label: 'GitHub', href: 'https://github.com/sairam-sundararaman/bit-collapse-geometry' }],
  },
  {
    title: 'Reproducing SAM',
    when: "Fall '25",
    summary:
      "I rebuilt Sharpness-Aware Minimization from scratch and got ~96% on CIFAR-10 against the paper's ~97%. Along the way I found two weak spots: SAM relies on weight decay without accounting for it, and its approximation gets worse at exactly the sharp minima it is meant to escape.",
    links: [
      { label: 'GitHub', href: 'https://github.com/sairam-sundararaman/sam-optimizer' },
      { label: 'W&B', href: 'https://wandb.ai/pesu-ai-ml/sam-replication-cifar10' },
    ],
  },
  {
    title: 'Optimization Pathologies',
    when: "Fall '25",
    summary:
      'A NumPy tool that maps 2D loss landscapes (Rosenbrock, Beale). It shows why plain SGD zigzags down narrow valleys and how momentum smooths the path out.',
    links: [{ label: 'GitHub', href: 'https://github.com/sairam-sundararaman/loss-landscape-calculus' }],
  },
  {
    title: 'Reverse-Mode AutoDiff Engine',
    when: "Summer '25",
    summary:
      'A scalar autograd engine written from scratch: reverse-mode differentiation over a dynamically built graph. It agrees with PyTorch to within 1e-6.',
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
