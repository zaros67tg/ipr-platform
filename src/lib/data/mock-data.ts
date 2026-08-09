import { 
  ResearcherProfile, 
  Paper, 
  Project, 
  Review, 
  ReviewCreditTransaction, 
  Match, 
  ResearchPost, 
  Comment,
  NotificationItem
} from '@/types';

export const CURRENT_USER: ResearcherProfile = {
  id: 'usr_zaros',
  name: 'Dr. Zaros H. Vance',
  handle: '@zaros',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  title: 'Principal Investigator',
  institution: 'Republic Institute for Neuromorphic Computing',
  bio: 'Investigating distributed event-driven kernels, mathematical models of cortical synchronization, and low-power hardware acceleration.',
  researchStatement: 'Interested in where computation becomes thought and where physical constraints dictate algorithm architecture.',
  primaryDomains: ['Systems Programming', 'Neuroscience', 'Artificial Intelligence'],
  secondaryDomains: ['Theoretical Physics', 'Robotics', 'Mathematics', 'Quantum Computing'],
  skills: ['C++', 'Rust', 'CUDA', 'Spiking Neural Networks', 'Formal Verification', 'Differential Equations', 'Neuromorphic Hardware'],
  techStack: ['Linux Kernel', 'PyTorch', 'LLVM', 'Verilog', 'RISC-V', 'KaTeX', 'MDX'],
  activeProjectsCount: 3,
  projectNeeds: ['Mathematical Modeller for stability proofs', 'Verilog Specialist for FPGA acceleration'],
  projectOffers: ['Low-level C/Rust kernel architecture', 'Spiking dynamics optimization'],
  availability: 'AVAILABLE',
  verificationStatus: 'RESEARCH_VERIFIED',
  orcid: '0000-0002-1829-9402',
  stats: {
    papersCount: 7,
    citationsCount: 142,
    reviewCredits: 7,
    reviewsCompleted: 14,
    forksCount: 18
  }
};

export const MOCK_RESEARCHERS: ResearcherProfile[] = [
  CURRENT_USER,
  {
    id: 'usr_elena',
    name: 'Dr. Elena Rostova',
    handle: '@erostova',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    title: 'Senior Researcher',
    institution: 'Zurich Theoretical Physics Laboratory',
    bio: 'Nonlinear dynamical systems, topological quantum states, and non-equilibrium statistical mechanics.',
    researchStatement: 'Seeking to formalize phase transitions in noisy high-dimensional state spaces.',
    primaryDomains: ['Theoretical Physics', 'Mathematics', 'Quantum Computing'],
    secondaryDomains: ['Artificial Intelligence', 'Philosophy of Technology'],
    skills: ['Quantum Field Theory', 'Differential Geometry', 'Python', 'Mathematica', 'Tensor Networks'],
    techStack: ['Qiskit', 'Julia', 'LaTeX', 'NumPy'],
    activeProjectsCount: 2,
    projectNeeds: ['Systems Programmer for distributed tensor contraction'],
    projectOffers: ['Formal mathematical derivations', 'Quantum state classification'],
    availability: 'SELECTIVE',
    verificationStatus: 'RESEARCH_VERIFIED',
    orcid: '0000-0001-9921-3041',
    stats: {
      papersCount: 12,
      citationsCount: 380,
      reviewCredits: 11,
      reviewsCompleted: 19,
      forksCount: 34
    }
  },
  {
    id: 'usr_marcus',
    name: 'Prof. Marcus Chen',
    handle: '@marcuschen',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    title: 'Director of Autonomous Systems',
    institution: 'Kyoto Robotics Observatory',
    bio: 'Geometric methods for distributed swarm robotics, real-time SLAM, and embodied control under latency.',
    researchStatement: 'Robotics is the ultimate physical proof of mathematical theory.',
    primaryDomains: ['Robotics', 'Computer Vision', 'Systems Programming'],
    secondaryDomains: ['Artificial Intelligence', 'Cybersecurity'],
    skills: ['ROS 2', 'C++', 'Control Theory', 'Kalman Filtering', 'LiDAR SLAM', 'Embedded Systems'],
    techStack: ['Gazebo', 'OpenCV', 'PCL', 'FreeRTOS'],
    activeProjectsCount: 4,
    projectNeeds: ['Neuroscience Researcher for biomimetic sensory integration'],
    projectOffers: ['Hardware control rigs', 'Real-world drone flight testbed'],
    availability: 'AVAILABLE',
    verificationStatus: 'INSTITUTION_VERIFIED',
    orcid: '0000-0003-4412-8800',
    stats: {
      papersCount: 19,
      citationsCount: 510,
      reviewCredits: 9,
      reviewsCompleted: 16,
      forksCount: 52
    }
  },
  {
    id: 'usr_aarya',
    name: 'Dr. Aarya Thorne',
    handle: '@athorne',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    title: 'Computational Biologist',
    institution: 'Cambridge Genomic Dynamics Centre',
    bio: 'Protein folding kinetics, sparse graph neural networks for molecular dynamics, and evolutionary computing.',
    researchStatement: 'Deciphering the implicit algorithmic computational principles encoded in biomolecules.',
    primaryDomains: ['Computational Biology', 'Artificial Intelligence', 'Materials Science'],
    secondaryDomains: ['Neuroscience', 'Mathematics'],
    skills: ['Molecular Dynamics', 'Graph Neural Networks', 'PyTorch', 'Rust', 'BioPython'],
    techStack: ['GROMACS', 'AlphaFold Pipeline', 'CUDA', 'Nextflow'],
    activeProjectsCount: 2,
    projectNeeds: ['Quantum computing expert for molecular Hamiltonian simulation'],
    projectOffers: ['Curated protein dataset pipelines', 'GPU cluster access'],
    availability: 'SELECTIVE',
    verificationStatus: 'RESEARCH_VERIFIED',
    orcid: '0000-0002-4410-1122',
    stats: {
      papersCount: 9,
      citationsCount: 215,
      reviewCredits: 5,
      reviewsCompleted: 10,
      forksCount: 15
    }
  },
  {
    id: 'usr_liam',
    name: 'Prof. Liam K. Solloway',
    handle: '@solloway',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    title: 'Chair of Epistemology & AI Ethics',
    institution: 'Republic Academy of Science & Philosophy',
    bio: 'Formal philosophy of mind, computational limits of self-modifying agents, and epistemic boundaries.',
    researchStatement: 'Questioning the foundational axioms of autonomous scientific deduction.',
    primaryDomains: ['Philosophy of Technology', 'Artificial Intelligence', 'Mathematics'],
    secondaryDomains: ['Theoretical Physics', 'Cybersecurity'],
    skills: ['Formal Logic', 'Model Theory', 'Category Theory', 'Gödelian Proofs', 'Technical Writing'],
    techStack: ['Coq', 'Lean Prover', 'LaTeX'],
    activeProjectsCount: 1,
    projectNeeds: ['AI engineer to test formal epistemic logic in LLM agents'],
    projectOffers: ['Rigorously constructed philosophical foundations'],
    availability: 'BUSY',
    verificationStatus: 'INSTITUTION_VERIFIED',
    orcid: '0000-0004-9102-3391',
    stats: {
      papersCount: 22,
      citationsCount: 640,
      reviewCredits: 15,
      reviewsCompleted: 28,
      forksCount: 41
    }
  },
  {
    id: 'usr_kenneth',
    name: 'Dr. Kenneth Braithwaite',
    handle: '@kbraithwaite',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    title: 'Principal Security Architect',
    institution: 'Decentralized Cryptographic Research Group',
    bio: 'Post-quantum lattice cryptography, zero-knowledge proofs, and micro-architectural side-channel isolation.',
    researchStatement: 'Building immutable mathematical boundaries against adversarial intelligence.',
    primaryDomains: ['Cybersecurity', 'Quantum Computing', 'Systems Programming'],
    secondaryDomains: ['Mathematics', 'Computer Vision'],
    skills: ['Lattice Cryptography', 'Rust', 'Assembly', 'ZKP (SNARKs)', 'Side-Channel Analysis'],
    techStack: ['circom', 'LLVM', 'OpenSSL', 'Valgrind'],
    activeProjectsCount: 3,
    projectNeeds: ['Mathematical prover for lattice error estimation'],
    projectOffers: ['High-performance C/Assembly implementations'],
    availability: 'AVAILABLE',
    verificationStatus: 'RESEARCH_VERIFIED',
    orcid: '0000-0001-7729-3388',
    stats: {
      papersCount: 14,
      citationsCount: 310,
      reviewCredits: 8,
      reviewsCompleted: 15,
      forksCount: 29
    }
  }
];

export const MOCK_PAPERS: Paper[] = [
  {
    id: 'pap_neuromorphic_stability',
    slug: 'temporal-stability-sparse-spiking-architectures',
    title: 'Temporal Stability in Sparse Spiking Neural Architectures Under Noise',
    abstract: 'We present a rigorous mathematical proof of temporal phase-locking stability in event-driven neuromorphic networks characterized by sparse coupling. By projecting membrane potential dynamics onto a bounded manifold, we derive the critical synaptic weight boundary beyond which chaotic divergence occurs. Experimental validation on custom 28nm asynchronous hardware demonstrates a 40x reduction in power consumption while preserving sub-millisecond spiking precision.',
    authors: [
      { id: 'usr_zaros', name: 'Dr. Zaros H. Vance', handle: '@zaros', institution: 'Republic Institute for Neuromorphic Computing' },
      { id: 'usr_elena', name: 'Dr. Elena Rostova', handle: '@erostova', institution: 'Zurich Theoretical Physics Laboratory' }
    ],
    primaryDomain: 'Neuroscience',
    subdomains: ['Neuromorphic AI', 'Dynamical Systems', 'Systems Engineering'],
    keywords: ['Spiking Neural Networks', 'Phase Locking', 'Lyapunov Exponents', 'Neuromorphic Hardware', 'Event-Driven Systems'],
    currentVersion: 'v2.1.0',
    status: 'PUBLISHED',
    license: 'CC-BY-4.0',
    readingTimeMinutes: 14,
    repositoryUrl: 'https://github.com/republic-research/neuromorphic-temporal-stability',
    codespacesUrl: 'https://github.com/codespaces/new?repo=republic-research/neuromorphic-temporal-stability',
    citationCount: 48,
    forkCount: 12,
    upvoteCount: 184,
    createdAt: '2026-06-12T10:00:00Z',
    publishedAt: '2026-07-01T14:30:00Z',
    coverImage: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=1200',
    versions: [
      {
        version: 'v2.1.0',
        releasedAt: '2026-07-01T14:30:00Z',
        changelog: 'Added FPGA benchmarking validation data and resolved edge-case decay parameters in Equation 4.',
        blocks: [
          {
            id: 'b1',
            type: 'heading',
            content: '1. Introduction & Theoretical Motivation',
            metadata: { headingLevel: 1 },
            commentsCount: 2
          },
          {
            id: 'b2',
            type: 'paragraph',
            content: 'Biological cortical networks operate with remarkable energetic efficiency, consuming less than 20 Watts while executing complex multi-modal sensory integration. In contrast, artificial deep learning architectures rely on continuous dense matrix multiplication. Neuromorphic spike-based architectures offer a promising alternative, but maintaining phase synchronization under inherent hardware thermal noise remains an unsolved challenge.',
            commentsCount: 5
          },
          {
            id: 'b3',
            type: 'heading',
            content: '2. Mathematical Formulation of Membrane Dynamics',
            metadata: { headingLevel: 2 },
            commentsCount: 0
          },
          {
            id: 'b4',
            type: 'paragraph',
            content: 'Consider a network of $N$ leaky integrate-and-fire (LIF) neurons where the membrane potential $V_i(t)$ of neuron $i$ evolves according to the non-linear differential equation:',
            commentsCount: 1
          },
          {
            id: 'b5',
            type: 'equation',
            content: '\\tau_m \\frac{dV_i(t)}{dt} = -(V_i(t) - V_{\\text{rest}}) + R_m I_{\\text{syn}, i}(t) + \\xi_i(t)',
            metadata: {
              latex: '\\tau_m \\frac{dV_i(t)}{dt} = -(V_i(t) - V_{\\text{rest}}) + R_m I_{\\text{syn}, i}(t) + \\xi_i(t)'
            },
            commentsCount: 8
          },
          {
            id: 'b6',
            type: 'paragraph',
            content: 'Here $\\tau_m$ denotes the membrane time constant, $R_m$ represents input resistance, and $\\xi_i(t)$ represents zero-mean Gaussian white noise modeling thermal flux across physical transistor gates. When $V_i(t) \\ge V_{\\text{thresh}}$, the neuron fires a discrete spike $\\delta(t - t_i^k)$ and resets instantly to $V_{\\text{reset}}$.',
            commentsCount: 3
          },
          {
            id: 'b7',
            type: 'heading',
            content: '3. Lyapunov Exponent Bound for Synaptic Coupling',
            metadata: { headingLevel: 2 },
            commentsCount: 1
          },
          {
            id: 'b8',
            type: 'equation',
            content: '\\lambda_{\\max} = \\lim_{t \\to \\infty} \\frac{1}{t} \\ln \\frac{\\| \\delta \\mathbf{V}(t) \\|}{\\| \\delta \\mathbf{V}(0) \\|} < 0 \\implies w_{ij} < \\frac{\\tau_m}{\\sqrt{N \\cdot \\sigma_s^2}}',
            metadata: {
              latex: '\\lambda_{\\max} = \\lim_{t \\to \\infty} \\frac{1}{t} \\ln \\frac{\\| \\delta \\mathbf{V}(t) \\|}{\\| \\delta \\mathbf{V}(0) \\|} < 0 \\implies w_{ij} < \\frac{\\tau_m}{\\sqrt{N \\cdot \\sigma_s^2}}'
            },
            commentsCount: 6
          },
          {
            id: 'b9',
            type: 'heading',
            content: '4. C++ Asynchronous Simulation Kernel',
            metadata: { headingLevel: 2 },
            commentsCount: 0
          },
          {
            id: 'b10',
            type: 'code',
            content: `// Asynchronous Spiking LIF Kernel with Atomic Spike Queues
#include <vector>
#include <atomic>
#include <cmath>

struct NeuronState {
    float membrane_potential;
    float last_spike_time;
    std::atomic<bool> is_refractory;
};

void update_lif_batch(NeuronState* neurons, const float* synaptic_currents, 
                     float dt, float tau_m, size_t count) {
    #pragma omp parallel for
    for (size_t i = 0; i < count; ++i) {
        if (neurons[i].is_refractory.load(std::memory_order_relaxed)) continue;
        
        float dv = (-(neurons[i].membrane_potential - 0.0f) + synaptic_currents[i]) * (dt / tau_m);
        neurons[i].membrane_potential += dv;
        
        if (neurons[i].membrane_potential >= 1.0f) { // Threshold = 1.0V
            neurons[i].membrane_potential = 0.0f; // Reset
            neurons[i].is_refractory.store(true, std::memory_order_release);
        }
    }
}`,
            metadata: {
              codeLanguage: 'cpp',
              repoPath: 'src/kernels/spiking_lif.cpp'
            },
            commentsCount: 4
          },
          {
            id: 'b11',
            type: 'heading',
            content: '5. Conclusion & Open Directions',
            metadata: { headingLevel: 2 },
            commentsCount: 1
          },
          {
            id: 'b12',
            type: 'paragraph',
            content: 'Our theoretical bounds successfully prevent hyper-synchronous epileptic activity in physical hardware chips. Future work will extend this framework to recurrent plastic synapses governed by Spike-Timing-Dependent Plasticity (STDP).',
            commentsCount: 2
          }
        ]
      }
    ]
  },
  {
    id: 'pap_formal_constraints',
    slug: 'formal-constraints-emergent-computation',
    title: 'Formal Constraints on Emergent Computation in Distributed Agent Networks',
    abstract: 'We establish fundamental bounds on the computational complexity achievable by self-modifying autonomous multi-agent systems operating under bounded communication bandwidth. Utilizing category-theoretic limits and algorithmic information theory, we prove that certain global consensus invariant states are undecidable without explicit hierarchical coordination.',
    authors: [
      { id: 'usr_liam', name: 'Prof. Liam K. Solloway', handle: '@solloway', institution: 'Republic Academy of Science & Philosophy' },
      { id: 'usr_elena', name: 'Dr. Elena Rostova', handle: '@erostova', institution: 'Zurich Theoretical Physics Laboratory' }
    ],
    primaryDomain: 'Mathematics',
    subdomains: ['Category Theory', 'Philosophy of Technology', 'Artificial Intelligence'],
    keywords: ['Category Theory', 'Distributed Systems', 'Emergent Computation', 'Undecidability', 'Autonomous Agents'],
    currentVersion: 'v1.0.0',
    status: 'PUBLISHED',
    license: 'MIT',
    readingTimeMinutes: 18,
    repositoryUrl: 'https://github.com/republic-research/emergent-formal-bounds',
    codespacesUrl: 'https://github.com/codespaces/new?repo=republic-research/emergent-formal-bounds',
    citationCount: 92,
    forkCount: 21,
    upvoteCount: 230,
    createdAt: '2026-05-18T09:00:00Z',
    publishedAt: '2026-06-01T11:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=1200',
    versions: [
      {
        version: 'v1.0.0',
        releasedAt: '2026-06-01T11:00:00Z',
        changelog: 'Initial publication.',
        blocks: [
          {
            id: 'fc1',
            type: 'heading',
            content: '1. Topological Invariants of Autonomous Communication',
            metadata: { headingLevel: 1 },
            commentsCount: 4
          },
          {
            id: 'fc2',
            type: 'paragraph',
            content: 'When individual agents continuously update their internal probabilistic models based on partial environment observations, the global joint distribution forms a sheaf over the communication topology space $\\mathcal{X}$.',
            commentsCount: 3
          },
          {
            id: 'fc3',
            type: 'equation',
            content: 'H^k(\\mathcal{X}, \\mathcal{F}) \\neq 0 \\implies \\text{Obstruction to Global Consensus}',
            metadata: { latex: 'H^k(\\mathcal{X}, \\mathcal{F}) \\neq 0 \\implies \\text{Obstruction to Global Consensus}' },
            commentsCount: 9
          }
        ]
      }
    ]
  },
  {
    id: 'pap_geometric_robotic_navigation',
    slug: 'geometric-methods-distributed-robotic-navigation',
    title: 'Geometric Riemannian Methods for Micro-Robotic Fleet Navigation',
    abstract: 'Navigation of dense autonomous fleets in unmapped subterranean environments requires real-time collision-free trajectories on dynamic manifolds. We propose a differential geometric control framework using Riemannian metric optimization that guarantees asymptotic convergence to target coordinates while maintaining swarm connectivity.',
    authors: [
      { id: 'usr_marcus', name: 'Prof. Marcus Chen', handle: '@marcuschen', institution: 'Kyoto Robotics Observatory' },
      { id: 'usr_zaros', name: 'Dr. Zaros H. Vance', handle: '@zaros', institution: 'Republic Institute for Neuromorphic Computing' }
    ],
    primaryDomain: 'Robotics',
    subdomains: ['Differential Geometry', 'Control Theory', 'Systems Programming'],
    keywords: ['Riemannian Geometry', 'Micro-Robotics', 'Swarm Control', 'Real-Time Trajectories'],
    currentVersion: 'v1.2.0',
    status: 'PUBLISHED',
    license: 'Apache-2.0',
    readingTimeMinutes: 16,
    repositoryUrl: 'https://github.com/republic-research/riemannian-swarm-nav',
    codespacesUrl: 'https://github.com/codespaces/new?repo=republic-research/riemannian-swarm-nav',
    citationCount: 64,
    forkCount: 19,
    upvoteCount: 156,
    createdAt: '2026-04-10T12:00:00Z',
    publishedAt: '2026-05-15T16:20:00Z',
    coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200',
    versions: [
      {
        version: 'v1.2.0',
        releasedAt: '2026-05-15T16:20:00Z',
        changelog: 'Added obstacle manifold deformation theorems.',
        blocks: [
          {
            id: 'rn1',
            type: 'heading',
            content: '1. Manifold Metric Formulation',
            metadata: { headingLevel: 1 },
            commentsCount: 1
          },
          {
            id: 'rn2',
            type: 'equation',
            content: 'g_{ij}(x) = \\delta_{ij} + \\sum_{k=1}^M \\frac{\\alpha_k}{(x - p_k)^2 + \\epsilon^2}',
            metadata: { latex: 'g_{ij}(x) = \\delta_{ij} + \\sum_{k=1}^M \\frac{\\alpha_k}{(x - p_k)^2 + \\epsilon^2}' },
            commentsCount: 5
          }
        ]
      }
    ]
  },
  {
    id: 'pap_lattice_crypto_isolation',
    slug: 'lattice-crypto-microarchitectural-isolation',
    title: 'Zero-Knowledge Lattice Cryptography with Constant-Time Hardware Isolation',
    abstract: 'Microarchitectural side channels threaten quantum-resistant lattice cryptographic implementations. We introduce a hardware-software co-designed primitive that enforces constant-time polynomial multiplication in lattice ring structures while isolating memory access patterns at the L1 cache level.',
    authors: [
      { id: 'usr_kenneth', name: 'Dr. Kenneth Braithwaite', handle: '@kbraithwaite', institution: 'Decentralized Cryptographic Research Group' }
    ],
    primaryDomain: 'Cybersecurity',
    subdomains: ['Quantum Computing', 'Systems Programming', 'Lattice Cryptography'],
    keywords: ['Post-Quantum Cryptography', 'Lattice Ring', 'Side-Channel Protection', 'Zero-Knowledge'],
    currentVersion: 'v1.0.0',
    status: 'PUBLISHED',
    license: 'BSD-3-Clause',
    readingTimeMinutes: 15,
    repositoryUrl: 'https://github.com/republic-research/zk-lattice-constanttime',
    citationCount: 37,
    forkCount: 8,
    upvoteCount: 112,
    createdAt: '2026-06-20T14:00:00Z',
    publishedAt: '2026-07-10T10:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200',
    versions: [
      {
        version: 'v1.0.0',
        releasedAt: '2026-07-10T10:00:00Z',
        changelog: 'Initial manuscript.',
        blocks: [
          {
            id: 'zk1',
            type: 'heading',
            content: '1. Ring-Learning With Errors (R-LWE) Formulations',
            metadata: { headingLevel: 1 },
            commentsCount: 2
          },
          {
            id: 'zk2',
            type: 'equation',
            content: 'b = a \\cdot s + e \\pmod{q}, \\quad a, s, e \\in R_q = \\mathbb{Z}_q[X]/(X^n + 1)',
            metadata: { latex: 'b = a \\cdot s + e \\pmod{q}, \\quad a, s, e \\in R_q = \\mathbb{Z}_q[X]/(X^n + 1)' },
            commentsCount: 7
          }
        ]
      }
    ]
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj_neuromorphic_vision',
    slug: 'low-power-neuromorphic-vision',
    title: 'Low-Power Neuromorphic Vision Under Severe Constraints',
    researchQuestion: 'Can event-driven spike vision algorithms achieve zero-latency object tracking on sub-milliwatt ASIC hardware?',
    description: 'Developing a novel spiking convolutional pipeline integrated directly with dynamic vision sensors (DVS). The project bridges neuroscience models of retina ganglion cells with real-time embedded C++ implementation.',
    domain: 'Neuroscience',
    status: 'ACTIVE',
    team: [
      { id: 'usr_zaros', name: 'Dr. Zaros H. Vance', avatarUrl: CURRENT_USER.avatarUrl, role: 'Lead Architect' },
      { id: 'usr_marcus', name: 'Prof. Marcus Chen', avatarUrl: MOCK_RESEARCHERS[2].avatarUrl, role: 'Hardware Rigs & Flight Testbed' }
    ],
    requiredSkills: ['C++', 'CUDA', 'Spiking Neural Networks', 'Verilog FPGA', 'Computer Vision'],
    openRoles: ['Mathematical Modeller for phase stability', 'Embedded Systems Engineer'],
    repositoryUrl: 'https://github.com/republic-research/neuromorphic-vision-project',
    papers: [
      { id: 'pap_neuromorphic_stability', title: 'Temporal Stability in Sparse Spiking Neural Architectures', slug: 'temporal-stability-sparse-spiking-architectures' }
    ],
    activityCount: 42,
    createdAt: '2026-05-01T08:00:00Z'
  },
  {
    id: 'proj_zk_lattice',
    slug: 'post-quantum-lattice-kernels',
    title: 'Post-Quantum Lattice Kernel Isolation',
    researchQuestion: 'How can zero-knowledge lattice proofs be executed on commodity CPUs without secret key leakage through L1 cache timing?',
    description: 'Building an open-source Rust framework for post-quantum cryptographic primitives equipped with formal verification of assembly execution paths.',
    domain: 'Cybersecurity',
    status: 'SEEKING_COLLABORATORS',
    team: [
      { id: 'usr_kenneth', name: 'Dr. Kenneth Braithwaite', avatarUrl: MOCK_RESEARCHERS[5].avatarUrl, role: 'Principal Cryptographer' }
    ],
    requiredSkills: ['Rust', 'Assembly', 'Lattice Cryptography', 'Coq / Lean Prover'],
    openRoles: ['Formal Prover Specialist', 'Low-Level Kernel Auditor'],
    repositoryUrl: 'https://github.com/republic-research/zk-lattice-constanttime',
    papers: [
      { id: 'pap_lattice_crypto_isolation', title: 'Zero-Knowledge Lattice Cryptography with Constant-Time Hardware Isolation', slug: 'lattice-crypto-microarchitectural-isolation' }
    ],
    activityCount: 19,
    createdAt: '2026-06-10T11:30:00Z'
  },
  {
    id: 'proj_riemannian_drones',
    slug: 'riemannian-subterranean-drones',
    title: 'Riemannian Swarm Control for Subterranean Exploration',
    researchQuestion: 'Can non-Euclidean geometric potential fields enable 100+ autonomous micro-drones to explore unmapped caves without central relay?',
    description: 'Combining Riemannian geometry with lightweight mesh radio relays to guarantee continuous swarm connectivity in GPS-denied environments.',
    domain: 'Robotics',
    status: 'ACTIVE',
    team: [
      { id: 'usr_marcus', name: 'Prof. Marcus Chen', avatarUrl: MOCK_RESEARCHERS[2].avatarUrl, role: 'Principal Investigator' },
      { id: 'usr_elena', name: 'Dr. Elena Rostova', avatarUrl: MOCK_RESEARCHERS[1].avatarUrl, role: 'Geometrical Modeller' }
    ],
    requiredSkills: ['ROS 2', 'Differential Geometry', 'C++', 'Mesh Networking'],
    openRoles: ['Embedded C Programmer', 'RF Mesh Protocol Engineer'],
    repositoryUrl: 'https://github.com/republic-research/riemannian-swarm-nav',
    papers: [
      { id: 'pap_geometric_robotic_navigation', title: 'Geometric Riemannian Methods for Micro-Robotic Fleet Navigation', slug: 'geometric-methods-distributed-robotic-navigation' }
    ],
    activityCount: 56,
    createdAt: '2026-03-15T09:00:00Z'
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev_101',
    paperId: 'pap_neuromorphic_stability',
    paperTitle: 'Temporal Stability in Sparse Spiking Neural Architectures Under Noise',
    paperSlug: 'temporal-stability-sparse-spiking-architectures',
    reviewerId: 'usr_elena',
    reviewerName: 'Dr. Elena Rostova',
    reviewerAvatar: MOCK_RESEARCHERS[1].avatarUrl,
    reviewerVerification: 'RESEARCH_VERIFIED',
    wordCount: 420,
    content: {
      summary: 'This manuscript establishes an important analytical bound on phase-locking stability in leaky integrate-and-fire spike architectures subject to Gaussian thermal flux. The mathematical derivation in Section 3 is elegant and grounded in Lyapunov stability theory.',
      methodology: 'The projection of membrane potentials onto a bounded manifold is sound. However, the assumption of uncorrelated Gaussian white noise across physical silicon gates warrants further justification in ambient multi-core operating regimes.',
      mathematicalConcerns: 'Equation (4) omits the non-linear coupling tensor term $K_{ijk}$. While acceptable for first-order approximations, this must be explicitly noted in the assumptions section.',
      technicalConcerns: 'The open-source C++ kernel utilizes OpenMP for multithreading. For sub-millisecond precision, explicit atomic hardware barriers on dedicated bare-metal microcontrollers would yield cleaner benchmarking.',
      codeConcerns: 'The provided C++ LIF simulation in Section 4 compiles cleanly against C++17 and demonstrates expected spike reset behavior.',
      strengths: 'Rigorous mathematical formulation, clear practical implications for low-power neuromorphic hardware design, open-source code repository provided.',
      weaknesses: 'Assumptions regarding independent noise channels across physical gates could be challenged under high thermal load.',
      suggestions: 'Add a explicit discussion on thermal cross-talk in multi-core neuromorphic chips to solidify Section 5.'
    },
    recommendation: 'ACCEPT',
    qualityScores: {
      technicalDepth: 94,
      specificity: 90,
      methodology: 96,
      reproducibility: 92
    },
    reviewCreditsEarned: 1,
    createdAt: '2026-06-25T14:00:00Z'
  },
  {
    id: 'rev_102',
    paperId: 'pap_formal_constraints',
    paperTitle: 'Formal Constraints on Emergent Computation in Distributed Agent Networks',
    paperSlug: 'formal-constraints-emergent-computation',
    reviewerId: 'usr_zaros',
    reviewerName: 'Dr. Zaros H. Vance',
    reviewerAvatar: CURRENT_USER.avatarUrl,
    reviewerVerification: 'RESEARCH_VERIFIED',
    wordCount: 510,
    content: {
      summary: 'A foundational contribution to multi-agent epistemology and category-theoretic computational limits. Solloway & Rostova demonstrate that global joint consensus distributions over non-trivial topologies encounter sheaf-theoretic obstructions.',
      methodology: 'The proof utilizes standard sheaf cohomology mechanisms ($H^k(\\mathcal{X}, \\mathcal{F})$) to demonstrate undecidability. The logical progression from local agent updates to topological obstructions is airtight.',
      mathematicalConcerns: 'None. The category-theoretic definitions align precisely with canonical literature.',
      technicalConcerns: 'While theoretical, a toy simulation demonstrating consensus failure in a simulated 5-agent graph would greatly enhance reader intuition.',
      codeConcerns: 'No code repository was attached to this theoretical manuscript.',
      strengths: 'Profound theoretical impact for autonomous scientific multi-agent systems; pristine clarity of mathematical exposition.',
      weaknesses: 'Highly abstract. May prove challenging to digest for applied machine learning practitioners without category theory backgrounds.',
      suggestions: 'Include a simplified 2D topological diagram illustrating a non-vanishing 1-cohomology obstruction.'
    },
    recommendation: 'ACCEPT',
    qualityScores: {
      technicalDepth: 98,
      specificity: 94,
      methodology: 99,
      reproducibility: 88
    },
    reviewCreditsEarned: 1,
    createdAt: '2026-05-28T09:30:00Z'
  }
];

export const MOCK_TRANSACTIONS: ReviewCreditTransaction[] = [
  {
    id: 'tx_1',
    userId: 'usr_zaros',
    amount: 1,
    type: 'REVIEW_EARNED',
    referenceId: 'rev_102',
    reason: 'Completed 510-word qualifying review for "Formal Constraints on Emergent Computation"',
    timestamp: '2026-05-28T09:30:00Z',
    balanceAfter: 8
  },
  {
    id: 'tx_2',
    userId: 'usr_zaros',
    amount: -3,
    type: 'MANUSCRIPT_SUBMISSION',
    referenceId: 'pap_neuromorphic_stability',
    reason: 'Submitted manuscript for Free Community Peer Review',
    timestamp: '2026-06-12T10:00:00Z',
    balanceAfter: 5
  },
  {
    id: 'tx_3',
    userId: 'usr_zaros',
    amount: 1,
    type: 'REVIEW_EARNED',
    referenceId: 'rev_103',
    reason: 'Completed qualifying review for "Zero-Knowledge Lattice Cryptography"',
    timestamp: '2026-06-28T16:00:00Z',
    balanceAfter: 6
  },
  {
    id: 'tx_4',
    userId: 'usr_zaros',
    amount: 1,
    type: 'REVIEW_EARNED',
    referenceId: 'rev_104',
    reason: 'Completed qualifying review for "Riemannian Methods in Swarm Control"',
    timestamp: '2026-07-15T11:00:00Z',
    balanceAfter: 7
  }
];

export const MOCK_MATCHES: Match[] = [
  {
    id: 'mat_1',
    candidate: MOCK_RESEARCHERS[1], // Dr. Elena Rostova
    project: MOCK_PROJECTS[0],
    compatibilityScore: 91,
    scoreBreakdown: {
      domainComplementarity: 28, // /30
      skillComplementarity: 24, // /25
      projectNeedAlignment: 19, // /20
      researchInterest: 12, // /15
      availability: 8 // /10
    },
    reason: 'Dr. Rostova provides exceptional nonlinear dynamical math modeling to formalize phase stability in your Neuromorphic Spiking project.',
    matchedSkills: ['Differential Equations', 'Tensor Networks', 'Mathematica'],
    matchedDomains: ['Theoretical Physics', 'Mathematics'],
    status: 'NEW',
    createdAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'mat_2',
    candidate: MOCK_RESEARCHERS[2], // Prof. Marcus Chen
    project: MOCK_PROJECTS[0],
    compatibilityScore: 87,
    scoreBreakdown: {
      domainComplementarity: 26,
      skillComplementarity: 23,
      projectNeedAlignment: 18,
      researchInterest: 11,
      availability: 9
    },
    reason: 'Prof. Chen brings physical drone testbeds and real-time C++ hardware control rigs complementary to your spiking vision algorithms.',
    matchedSkills: ['Embedded Systems', 'C++', 'LiDAR SLAM'],
    matchedDomains: ['Robotics', 'Systems Programming'],
    status: 'CONNECTED',
    createdAt: '2026-07-28T14:20:00Z'
  },
  {
    id: 'mat_3',
    candidate: MOCK_RESEARCHERS[5], // Dr. Kenneth Braithwaite
    project: undefined,
    compatibilityScore: 82,
    scoreBreakdown: {
      domainComplementarity: 24,
      skillComplementarity: 22,
      projectNeedAlignment: 16,
      researchInterest: 12,
      availability: 8
    },
    reason: 'High technical overlap in C/Rust low-level kernel isolation and physical microarchitectural side-channel mitigation.',
    matchedSkills: ['Rust', 'Assembly', 'Side-Channel Analysis'],
    matchedDomains: ['Cybersecurity', 'Systems Programming'],
    status: 'SAVED',
    createdAt: '2026-08-04T09:15:00Z'
  }
];

export const MOCK_POSTS: ResearchPost[] = [
  {
    id: 'post_1',
    authorId: 'usr_zaros',
    authorName: 'Dr. Zaros H. Vance',
    authorAvatar: CURRENT_USER.avatarUrl,
    authorHandle: '@zaros',
    authorDomain: 'Systems Programming',
    type: 'PAPER_RELEASE',
    title: 'Paper Release: Temporal Stability in Sparse Spiking Neural Architectures',
    content: 'We have published Version 2.1 of our spiking neural network stability manuscript. We prove that phase locking remains strictly asymptotically stable under thermal noise as long as synaptic weight matrices satisfy our derived Lyapunov bound. Read the full interactive manuscript with LaTeX derivations and C++ LIF kernel below.',
    paperId: 'pap_neuromorphic_stability',
    paperTitle: 'Temporal Stability in Sparse Spiking Neural Architectures Under Noise',
    paperSlug: 'temporal-stability-sparse-spiking-architectures',
    tags: ['Neuromorphic', 'SpikingNeuralNetworks', 'C++', 'Lyapunov', 'PaperRelease'],
    upvotes: 42,
    commentsCount: 14,
    bookmarksCount: 19,
    isUpvoted: true,
    isBookmarked: true,
    createdAt: '2026-07-01T14:30:00Z',
    image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'post_2',
    authorId: 'usr_liam',
    authorName: 'Prof. Liam K. Solloway',
    authorAvatar: MOCK_RESEARCHERS[4].avatarUrl,
    authorHandle: '@solloway',
    authorDomain: 'Philosophy of Technology',
    type: 'RESEARCH_NOTE',
    title: 'Research Note: On the Computational Limitations of Autonomous Consensus',
    content: 'When evaluating multi-agent scientific systems, we must remain vigilant against assuming that non-hierarchical communication guarantees global truth convergence. Category theory demonstrates that non-vanishing cohomology classes act as irreducible obstructions to consensus. Are we reaching the epistemic limits of autonomous multi-agent deduction?',
    paperId: 'pap_formal_constraints',
    paperTitle: 'Formal Constraints on Emergent Computation in Distributed Agent Networks',
    paperSlug: 'formal-constraints-emergent-computation',
    tags: ['Epistemology', 'CategoryTheory', 'MultiAgentSystems', 'FormalLogic'],
    upvotes: 68,
    commentsCount: 22,
    bookmarksCount: 31,
    isUpvoted: false,
    isBookmarked: false,
    createdAt: '2026-07-12T18:10:00Z'
  },
  {
    id: 'post_3',
    authorId: 'usr_marcus',
    authorName: 'Prof. Marcus Chen',
    authorAvatar: MOCK_RESEARCHERS[2].avatarUrl,
    authorHandle: '@marcuschen',
    authorDomain: 'Robotics',
    type: 'REVIEW_REQUEST',
    title: 'Review Request: Geometric Riemannian Methods for Micro-Robotic Fleet Navigation',
    content: 'Looking for 2 verified peer reviewers with expertise in Differential Geometry or Embedded Control Systems to review our manuscript on micro-drones. Reviewers will earn +1 Review Credit upon completing a qualifying 300+ word review.',
    paperId: 'pap_geometric_robotic_navigation',
    paperTitle: 'Geometric Riemannian Methods for Micro-Robotic Fleet Navigation',
    paperSlug: 'geometric-methods-distributed-robotic-navigation',
    tags: ['ReviewRequest', 'Robotics', 'RiemannianGeometry', 'ControlTheory'],
    upvotes: 29,
    commentsCount: 8,
    bookmarksCount: 12,
    isUpvoted: false,
    isBookmarked: false,
    createdAt: '2026-07-20T09:45:00Z'
  },
  {
    id: 'post_4',
    authorId: 'usr_kenneth',
    authorName: 'Dr. Kenneth Braithwaite',
    authorAvatar: MOCK_RESEARCHERS[5].avatarUrl,
    authorHandle: '@kbraithwaite',
    authorDomain: 'Cybersecurity',
    type: 'CODE_RELEASE',
    title: 'Code Release: Constant-Time Lattice Arithmetic Kernel in Assembly & Rust',
    content: 'We have released our standalone L1-cache isolated lattice polynomial multiplication kernel on GitHub. Zero secret-dependent memory lookups guaranteed. Check out the repository or launch directly in GitHub Codespaces!',
    paperId: 'pap_lattice_crypto_isolation',
    paperTitle: 'Zero-Knowledge Lattice Cryptography with Constant-Time Hardware Isolation',
    paperSlug: 'lattice-crypto-microarchitectural-isolation',
    tags: ['CodeRelease', 'PostQuantum', 'Rust', 'Assembly', 'Cybersecurity'],
    upvotes: 54,
    commentsCount: 11,
    bookmarksCount: 25,
    isUpvoted: true,
    isBookmarked: false,
    createdAt: '2026-07-25T11:20:00Z'
  }
];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c_1',
    targetId: 'pap_neuromorphic_stability',
    targetType: 'equation',
    blockId: 'b5',
    authorId: 'usr_elena',
    authorName: 'Dr. Elena Rostova',
    authorAvatar: MOCK_RESEARCHERS[1].avatarUrl,
    authorHandle: '@erostova',
    content: 'In Equation #4, should the membrane decay constant $\\tau_m$ account for non-linear temperature variation across the physical die? At $85^\\circ\\text{C}$ transistor leakage currents deviate by up to 18%.',
    upvotes: 7,
    isResolved: false,
    createdAt: '2026-07-02T11:15:00Z',
    replies: [
      {
        id: 'c_1_1',
        targetId: 'pap_neuromorphic_stability',
        targetType: 'equation',
        blockId: 'b5',
        authorId: 'usr_zaros',
        authorName: 'Dr. Zaros H. Vance',
        authorAvatar: CURRENT_USER.avatarUrl,
        authorHandle: '@zaros',
        content: 'Good point Dr. Rostova. In our physical test chip we utilized on-die bandgap reference circuits to stabilize $\\tau_m$ against thermal drift up to $70^\\circ\\text{C}$. I will add a footnote in Section 2.2 clarifying this calibration.',
        upvotes: 5,
        isResolved: true,
        createdAt: '2026-07-02T13:40:00Z'
      }
    ]
  },
  {
    id: 'c_2',
    targetId: 'pap_neuromorphic_stability',
    targetType: 'block',
    blockId: 'b10',
    authorId: 'usr_marcus',
    authorName: 'Prof. Marcus Chen',
    authorAvatar: MOCK_RESEARCHERS[2].avatarUrl,
    authorHandle: '@marcuschen',
    content: 'The OpenMP pragma in line 11 handles parallel neuron potential updates well, but have you profiled cache line bouncing when multi-threading over 64+ cores?',
    upvotes: 4,
    isResolved: false,
    createdAt: '2026-07-04T15:20:00Z'
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    type: 'REVIEW_COMPLETED',
    title: 'Review Completed',
    message: 'Dr. Elena Rostova completed a qualifying peer review for your paper "Temporal Stability in Sparse Spiking Neural Architectures".',
    link: '/reviews/rev_101',
    isRead: false,
    createdAt: '2026-06-25T14:00:00Z'
  },
  {
    id: 'notif_2',
    type: 'CREDIT_EARNED',
    title: '+1 Review Credit Earned',
    message: 'You earned 1 Review Credit for your 510-word review of "Formal Constraints on Emergent Computation". Current balance: 7 credits.',
    link: '/reviews',
    isRead: false,
    createdAt: '2026-05-28T09:30:00Z'
  },
  {
    id: 'notif_3',
    type: 'MATCH_REQUEST',
    title: 'New High Compatibility Match',
    message: '91% Match found: Dr. Elena Rostova possesses complementary expertise for your Neuromorphic Vision project.',
    link: '/match',
    isRead: true,
    createdAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'notif_4',
    type: 'PAPER_CITED',
    title: 'Paper Cited',
    message: 'Your research paper was cited in "Formal Constraints on Emergent Computation in Distributed Agent Networks".',
    link: '/papers/formal-constraints-emergent-computation',
    isRead: true,
    createdAt: '2026-06-01T11:00:00Z'
  }
];
