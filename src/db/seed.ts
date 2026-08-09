import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL!;
console.log('Connecting to Supabase PostgreSQL for seeding...');

const sql = postgres(connectionString, { prepare: false, ssl: 'require' });

async function seed() {
  try {
    console.log('Seeding 6 realistic high-level research papers & users...');

    // 1. Seed Seed Users
    await sql`
      INSERT INTO users (id, name, email, email_verified, image, institution, is_academic_verified, review_credits)
      VALUES 
      ('usr_zaros', 'Dr. Zaros H. Vance', 'zaros@republic-research.org', TRUE, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400', 'Republic Institute for Neuromorphic Computing', TRUE, 7),
      ('usr_elena', 'Dr. Elena Rostova', 'elena@zurich-physics.ch', TRUE, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400', 'Zurich Theoretical Physics Laboratory', TRUE, 11),
      ('usr_marcus', 'Prof. Marcus Chen', 'marcus@kyoto-robotics.jp', TRUE, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', 'Kyoto Robotics Observatory', TRUE, 9),
      ('usr_aarya', 'Dr. Aarya Thorne', 'aarya@cambridge-genomics.ac.uk', TRUE, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400', 'Cambridge Genomic Dynamics Centre', TRUE, 5),
      ('usr_liam', 'Prof. Liam K. Solloway', 'solloway@republic-academy.org', TRUE, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400', 'Republic Academy of Science & Philosophy', TRUE, 15),
      ('usr_kenneth', 'Dr. Kenneth Braithwaite', 'kbrait@crypto-research.io', TRUE, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400', 'Decentralized Cryptographic Research Group', TRUE, 8)
      ON CONFLICT (id) DO UPDATE SET 
        name = EXCLUDED.name,
        review_credits = EXCLUDED.review_credits;
    `;

    // 2. Seed Initial Credit Ledger Transactions
    await sql`
      INSERT INTO review_credits_ledger (id, user_id, amount, type, reason, balance_after)
      VALUES
      ('tx_seed_1', 'usr_zaros', 1, 'REVIEW_EARNED', 'Completed qualifying 510-word peer review for "Formal Constraints on Emergent Computation"', 8),
      ('tx_seed_2', 'usr_zaros', -3, 'MANUSCRIPT_SUBMISSION', 'Submitted manuscript "Temporal Stability in Sparse Spiking Neural Architectures"', 5),
      ('tx_seed_3', 'usr_zaros', 1, 'REVIEW_EARNED', 'Completed qualifying review for "Zero-Knowledge Lattice Cryptography"', 6),
      ('tx_seed_4', 'usr_zaros', 1, 'REVIEW_EARNED', 'Completed qualifying review for "Geometric Riemannian Swarm Methods"', 7)
      ON CONFLICT (id) DO NOTHING;
    `;

    // 3. Seed 6 High-Level Realistic Research Papers using ON CONFLICT (slug)
    await sql`
      INSERT INTO papers (
        id, author_id, author_name, author_avatar, title, slug, abstract, content_mdx, primary_domain, repository_url, citation_count, fork_count, upvote_count, reading_time_minutes, is_featured
      ) VALUES 
      (
        'pap_neuromorphic_stability',
        'usr_zaros',
        'Dr. Zaros H. Vance',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        'Temporal Phase-Locking Stability in Sparse Spiking Neural Architectures',
        'temporal-stability-sparse-spiking-architectures',
        'We present a mathematical proof of temporal phase-locking stability in event-driven neuromorphic networks characterized by sparse coupling. By projecting membrane potential dynamics onto a bounded manifold, we derive the critical synaptic weight boundary beyond which chaotic divergence occurs.',
        '# Temporal Phase-Locking Stability in Sparse Spiking Neural Architectures\n\n## 1. Introduction & Biological Motivation\nBiological cortical networks operate with remarkable energetic efficiency, consuming less than 20 Watts while executing complex multi-modal sensory integration. In contrast, artificial deep learning architectures rely on continuous dense matrix multiplication.\n\nConsider a network of $N$ leaky integrate-and-fire (LIF) neurons where membrane potential $V_i(t)$ evolves according to:\n\n$$\\tau_m \\frac{dV_i(t)}{dt} = -(V_i(t) - V_{\\text{rest}}) + R_m I_{\\text{syn}, i}(t) + \\xi_i(t)$$\n\nHere $\\tau_m$ denotes membrane time constant, $R_m$ represents input resistance, and $\\xi_i(t)$ represents zero-mean Gaussian white noise modeling thermal flux across physical transistor gates.\n\n## 2. Lyapunov Exponent Bound for Synaptic Coupling\nBy calculating the maximal Lyapunov exponent $\\lambda_{\\max}$ of the coupled phase system, we establish the critical synaptic boundary:\n\n$$\\lambda_{\\max} = \\lim_{t \\to \\infty} \\frac{1}{t} \\ln \\frac{\\| \\delta \\mathbf{V}(t) \\|}{\\| \\delta \\mathbf{V}(0) \\|} < 0 \\implies w_{ij} < \\frac{\\tau_m}{\\sqrt{N \\cdot \\sigma_s^2}}$$\n\nExperimental validation on asynchronous 28nm silicon chips demonstrates a 40x reduction in power consumption while preserving sub-millisecond spiking precision.',
        'Neuroscience',
        'https://github.com/republic-research/neuromorphic-temporal-stability',
        48, 12, 184, 14, TRUE
      ),
      (
        'pap_quantum_gravity_invariants',
        'usr_elena',
        'Dr. Elena Rostova',
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
        'Topological Invariants in Non-Equilibrium Quantum Gravity Models',
        'topological-invariants-quantum-gravity',
        'We formulate a non-perturbative topological quantum field theory describing space-time geometry fluctuations at the Planck scale. Using Chern-Simons invariant tensor contractions over spin foam manifolds, we derive exact bounds for quantum black hole entropy.',
        '# Topological Invariants in Non-Equilibrium Quantum Gravity Models\n\n## 1. Spin Foam Partition Functions\nThe partition function $Z(\\mathcal{M})$ over a 4-dimensional discretized manifold $\\mathcal{M}$ is defined as:\n\n$$Z(\\mathcal{M}) = \\sum_{\\rho, \\iota} \\prod_{v} A_v(\\rho_e, \\iota_v) \\prod_{e} d_e(\\rho_e)$$\n\nWhere $A_v$ is the vertex amplitude evaluated over $SU(2)$ representations $\\rho_e$ and intertwiners $\\iota_v$.\n\n## 2. Entropy Conservation Bounds\nEvaluating the horizon boundary state yields the exact Bekenstein-Hawking logarithmic correction:\n\n$$S_{\\text{BH}} = \\frac{A}{4 G \\hbar} - \\frac{3}{2} \\ln \\left(\\frac{A}{4 G \\hbar}\\right) + \\mathcal{O}(1)$$',
        'Theoretical Physics',
        'https://github.com/republic-research/quantum-gravity-spin-foams',
        86, 24, 210, 16, TRUE
      ),
      (
        'pap_formal_constraints_emergent',
        'usr_liam',
        'Prof. Liam K. Solloway',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
        'Formal Constraints on Emergent Computation in Distributed Agent Networks',
        'formal-constraints-emergent-computation',
        'We establish fundamental bounds on the computational complexity achievable by self-modifying autonomous multi-agent systems operating under bounded bandwidth. Utilizing category-theoretic limits, we prove global consensus invariant states are undecidable without explicit hierarchical coordination.',
        '# Formal Constraints on Emergent Computation\n\n## 1. Sheaf Obstructions to Consensus\nWhen individual agents continuously update internal probabilistic models, joint distributions form a sheaf over communication topology $\\mathcal{X}$.\n\n$$H^k(\\mathcal{X}, \\mathcal{F}) \\neq 0 \\implies \\text{Obstruction to Global Consensus}$$\n\nHence, uncoordinated decentralized agent graphs cannot resolve undecidable global invariants.',
        'Mathematics',
        'https://github.com/republic-research/emergent-formal-bounds',
        92, 21, 230, 18, FALSE
      ),
      (
        'pap_riemannian_robotic_swarm',
        'usr_marcus',
        'Prof. Marcus Chen',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
        'Geometric Riemannian Methods for Micro-Robotic Fleet Navigation',
        'geometric-methods-distributed-robotic-navigation',
        'Navigation of dense autonomous fleets in unmapped subterranean environments requires real-time collision-free trajectories on dynamic manifolds. We propose a differential geometric control framework using Riemannian metric optimization.',
        '# Geometric Riemannian Methods for Micro-Robotic Fleet Navigation\n\n## 1. Riemannian Obstacle Manifold\nWe deform the spatial metric $g_{ij}(x)$ around dynamic obstacle coordinates $p_k$:\n\n$$g_{ij}(x) = \\delta_{ij} + \\sum_{k=1}^M \\frac{\\alpha_k}{(x - p_k)^2 + \\epsilon^2}$$\n\nThis ensures geodesic trajectories naturally avoid obstacle boundaries while maintaining swarm mesh radio connectivity.',
        'Robotics',
        'https://github.com/republic-research/riemannian-swarm-nav',
        64, 19, 156, 15, FALSE
      ),
      (
        'pap_post_quantum_lattice',
        'usr_kenneth',
        'Dr. Kenneth Braithwaite',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
        'Zero-Knowledge Lattice Cryptography with Constant-Time Hardware Isolation',
        'lattice-crypto-microarchitectural-isolation',
        'Microarchitectural side channels threaten quantum-resistant lattice cryptographic implementations. We introduce a hardware-software co-designed primitive that enforces constant-time polynomial multiplication in lattice ring structures.',
        '# Zero-Knowledge Lattice Cryptography\n\n## 1. Ring-Learning With Errors (R-LWE)\nSecurity rests on the hardness of finding polynomial secrets $s \\in R_q$:\n\n$$b = a \\cdot s + e \\pmod{q}, \\quad a, s, e \\in R_q = \\mathbb{Z}_q[X]/(X^n + 1)$$\n\nOur assembly execution kernel eliminates L1 cache line timing leakage.',
        'Cybersecurity',
        'https://github.com/republic-research/zk-lattice-constanttime',
        37, 8, 112, 12, FALSE
      ),
      (
        'pap_molecular_graph_networks',
        'usr_aarya',
        'Dr. Aarya Thorne',
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
        'Sparse Graph Neural Networks for Protein Folding Kinetics',
        'sparse-graph-neural-networks-protein-folding',
        'Deciphering protein folding trajectories requires tracking multi-scale atomistic interactions. We present a sparse message-passing graph neural network that accelerates molecular dynamics simulations by 3 orders of magnitude while preserving Hamiltonian energy conservation.',
        '# Sparse Graph Neural Networks for Protein Folding Kinetics\n\n## 1. Energy-Conserving Hamiltonian Graphs\nThe molecular potential energy $\\hat{U}(x)$ is parameterized via SE(3)-equivariant graph convolutions:\n\n$$\\mathbf{h}_i^{(l+1)} = \\sigma \\left( \\sum_{j \\in \\mathcal{N}(i)} W^{(l)} \\cdot \\phi(r_{ij}) \\mathbf{h}_j^{(l)} \\right)$$\n\nThis guarantees exact conservation of total physical energy along folded backbone states.',
        'Computational Biology',
        'https://github.com/republic-research/protein-folding-gnn',
        53, 14, 178, 14, FALSE
      )
      ON CONFLICT (slug) DO UPDATE SET 
        title = EXCLUDED.title,
        abstract = EXCLUDED.abstract,
        content_mdx = EXCLUDED.content_mdx,
        citation_count = EXCLUDED.citation_count;
    `;

    console.log('✅ Successfully seeded 6 realistic research papers into live Supabase PostgreSQL database!');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await sql.end();
  }
}

seed();
