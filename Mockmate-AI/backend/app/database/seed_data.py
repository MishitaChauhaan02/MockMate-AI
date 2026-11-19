"""
Curated technical interview question bank for Mockmate AI.
Covers 10 categories across Beginner, Intermediate, and Advanced difficulties.
"""

INITIAL_QUESTIONS = [
    # 1. Data Structures and Algorithms
    {
        "category": "Data Structures and Algorithms",
        "difficulty": "Beginner",
        "question_text": "Explain the difference between an Array and a Linked List. When would you prefer one over the other?",
        "expected_concepts": ["contiguous memory allocation", "O(1) random access for arrays", "dynamic sizing", "O(1) insertion/deletion at head for linked lists", "cache locality"]
    },
    {
        "category": "Data Structures and Algorithms",
        "difficulty": "Beginner",
        "question_text": "What is a Hash Table and how does collision resolution work?",
        "expected_concepts": ["hash function", "key-value mapping", "chaining (linked lists/buckets)", "open addressing (linear probing)", "average O(1) time complexity"]
    },
    {
        "category": "Data Structures and Algorithms",
        "difficulty": "Intermediate",
        "question_text": "Describe how Dijkstra's algorithm finds the shortest path in a weighted graph. What are its limitations regarding negative weights?",
        "expected_concepts": ["greedy approach", "priority queue / min-heap", "relaxation of edges", "non-negative edge weights constraint", "time complexity O((V+E) log V)"]
    },
    {
        "category": "Data Structures and Algorithms",
        "difficulty": "Intermediate",
        "question_text": "Explain the concept of Dynamic Programming and compare the Top-Down (Memoization) approach with the Bottom-Up (Tabulation) approach.",
        "expected_concepts": ["optimal substructure", "overlapping subproblems", "recursion with cache (memoization)", "iterative table filling (tabulation)", "space optimization"]
    },
    {
        "category": "Data Structures and Algorithms",
        "difficulty": "Advanced",
        "question_text": "Explain the architecture and balancing mechanisms of an AVL Tree versus a Red-Black Tree. In what scenarios would you choose one over the other?",
        "expected_concepts": ["balance factor difference <= 1", "rotations (LL, RR, LR, RL)", "Red-Black tree color properties & height limit 2log(n+1)", "lookup heavy vs frequent insertion/deletion workloads"]
    },

    # 2. Python
    {
        "category": "Python",
        "difficulty": "Beginner",
        "question_text": "What is the difference between mutable and immutable data types in Python? Provide examples of each.",
        "expected_concepts": ["memory address identity", "lists/dicts/sets are mutable", "tuples/strings/integers are immutable", "side effects in function arguments"]
    },
    {
        "category": "Python",
        "difficulty": "Beginner",
        "question_text": "Explain Python list comprehensions and how they compare to the traditional map() and filter() functions.",
        "expected_concepts": ["concise syntax", "readability", "performance benefits", "conditional filtering", "nested expressions"]
    },
    {
        "category": "Python",
        "difficulty": "Intermediate",
        "question_text": "Explain how Python's Global Interpreter Lock (GIL) affects multi-threaded programs and how to achieve true concurrency for CPU-bound tasks.",
        "expected_concepts": ["GIL mutual exclusion lock", "one thread per core in CPython", "I/O bound vs CPU bound", "multiprocessing module", "alternative runtimes or async"]
    },
    {
        "category": "Python",
        "difficulty": "Intermediate",
        "question_text": "What are Python Generators and the 'yield' statement? How do they help with memory efficiency?",
        "expected_concepts": ["lazy evaluation", "generator object / iterator protocol", "state retention between yield calls", "streaming large datasets vs loading all into RAM"]
    },
    {
        "category": "Python",
        "difficulty": "Advanced",
        "question_text": "Explain Python decorators, how closures make them work, and write or describe a decorator that takes arguments (a decorator factory).",
        "expected_concepts": ["first-class functions", "closures and lexical scope", "functools.wraps", "three-level nested functions for parameterized decorators", "function metadata preservation"]
    },

    # 3. Java
    {
        "category": "Java",
        "difficulty": "Beginner",
        "question_text": "Explain the four core principles of Object-Oriented Programming (OOP) and how Java implements them.",
        "expected_concepts": ["encapsulation (private fields, getters/setters)", "inheritance (extends keyword)", "polymorphism (overloading and overriding)", "abstraction (interfaces and abstract classes)"]
    },
    {
        "category": "Java",
        "difficulty": "Beginner",
        "question_text": "What is the difference between '==' and '.equals()' in Java? Why should you override hashCode() when overriding equals()?",
        "expected_concepts": ["reference equality vs value/semantic equality", "Object.equals default behavior", "hash code contract for HashMaps and HashSets", "collision and bucket lookups"]
    },
    {
        "category": "Java",
        "difficulty": "Intermediate",
        "question_text": "How does Java Garbage Collection work? Explain the generational hypothesis (Young Generation, Old Generation, Metaspace).",
        "expected_concepts": ["Eden, Survivor spaces (S0, S1)", "Tenured / Old generation", "Minor GC vs Major / Full GC", "mark and sweep / compaction", "object reachability and roots"]
    },
    {
        "category": "Java",
        "difficulty": "Advanced",
        "question_text": "Explain the Java Memory Model (JMM), the 'happens-before' relationship, and the role of the 'volatile' keyword in concurrent programming.",
        "expected_concepts": ["visibility across CPU caches", "instruction reordering prevention", "volatile read/write barriers", "happens-before guarantee", "synchronized vs Atomic variables vs volatile"]
    },

    # 4. Machine Learning
    {
        "category": "Machine Learning",
        "difficulty": "Beginner",
        "question_text": "Explain the Bias-Variance tradeoff in machine learning. How do overfitting and underfitting relate to this tradeoff?",
        "expected_concepts": ["bias: simplifying assumptions / error from underfitting", "variance: sensitivity to training data fluctuations / error from overfitting", "model complexity curve", "regularization / cross-validation"]
    },
    {
        "category": "Machine Learning",
        "difficulty": "Intermediate",
        "question_text": "Compare Precision, Recall, F1-Score, and ROC-AUC. In an imbalanced dataset (e.g. credit card fraud detection), which metrics would you prioritize and why?",
        "expected_concepts": ["True Positives / False Positives / False Negatives", "Precision: TP/(TP+FP)", "Recall: TP/(TP+FN)", "cost of false negatives in fraud", "why accuracy is deceptive for class imbalance"]
    },
    {
        "category": "Machine Learning",
        "difficulty": "Advanced",
        "question_text": "How do Gradient Boosting algorithms (like XGBoost or LightGBM) differ from Random Forests in their ensemble strategy and optimization technique?",
        "expected_concepts": ["bagging (independent parallel trees) vs boosting (sequential residual fitting)", "gradient descent in function space", "loss function pseudo-residuals", "shrinkage / learning rate", "regularization in XGBoost"]
    },

    # 5. Artificial Intelligence
    {
        "category": "Artificial Intelligence",
        "difficulty": "Beginner",
        "question_text": "What is the difference between supervised, unsupervised, and reinforcement learning? Give a concrete real-world application for each.",
        "expected_concepts": ["labeled data vs unlabeled data vs environment reward signals", "classification/regression examples", "clustering/dimension reduction examples", "agent-state-action loops"]
    },
    {
        "category": "Artificial Intelligence",
        "difficulty": "Intermediate",
        "question_text": "Explain the Transformer architecture's Self-Attention mechanism. Why did it supersede traditional RNNs/LSTMs in Natural Language Processing?",
        "expected_concepts": ["Query, Key, Value vectors", "scaled dot-product attention softmax(QK^T / sqrt(d_k))V", "parallelization over sequential processing", "vanishing/exploding gradient elimination across long sequences"]
    },
    {
        "category": "Artificial Intelligence",
        "difficulty": "Advanced",
        "question_text": "Explain Retrieval-Augmented Generation (RAG). What are the key stages in a RAG pipeline and how do you mitigate hallucinations?",
        "expected_concepts": ["chunking and embedding documents", "vector database similarity search (cosine/HNSW)", "context injection into prompt", "re-ranking", "groundedness evaluation and prompt guardrails"]
    },

    # 6. Database Management Systems
    {
        "category": "Database Management Systems",
        "difficulty": "Beginner",
        "question_text": "Explain the ACID properties of relational database transactions and provide an example of how each property protects data integrity.",
        "expected_concepts": ["Atomicity (all or nothing rollback)", "Consistency (schema invariants/constraints)", "Isolation (concurrency visibility levels)", "Durability (WAL / persisted to disk)"]
    },
    {
        "category": "Database Management Systems",
        "difficulty": "Intermediate",
        "question_text": "How do B-Trees and B+ Trees work as database indexing structures? Why are B+ Trees preferred over regular binary search trees for disk storage?",
        "expected_concepts": ["high branching factor / low tree height", "disk page / I/O block alignment", "all data records in leaf nodes", "linked list pointers between leaves for fast range queries"]
    },
    {
        "category": "Database Management Systems",
        "difficulty": "Advanced",
        "question_text": "Explain the different Transaction Isolation Levels defined by SQL (Read Uncommitted, Read Committed, Repeatable Read, Serializable) and the concurrency anomalies they prevent.",
        "expected_concepts": ["dirty read", "non-repeatable read", "phantom read", "two-phase locking (2PL) vs MVCC (Multi-Version Concurrency Control)", "snapshot isolation"]
    },

    # 7. Operating Systems
    {
        "category": "Operating Systems",
        "difficulty": "Beginner",
        "question_text": "What is the difference between a Process and a Thread? How do they share system resources such as memory?",
        "expected_concepts": ["independent address space vs shared memory within process", "PCB vs TCB", "context switching overhead", "threads share heap, code, files; have own stack and registers"]
    },
    {
        "category": "Operating Systems",
        "difficulty": "Intermediate",
        "question_text": "What are the four Coffman conditions necessary for a Deadlock to occur? What strategies can an operating system use to prevent or resolve deadlocks?",
        "expected_concepts": ["mutual exclusion", "hold and wait", "no preemption", "circular wait", "resource ordering, Banker's algorithm, detection & termination"]
    },
    {
        "category": "Operating Systems",
        "difficulty": "Advanced",
        "question_text": "Explain Virtual Memory, Paging, Page Tables, and the Translation Lookaside Buffer (TLB). What happens during a Page Fault?",
        "expected_concepts": ["logical vs physical address space", "multi-level page tables", "TLB cache for virtual-to-physical translation", "hardware interrupt on page fault", "disk swap fetch and replacement algorithms (LRU)"]
    },

    # 8. Computer Networks
    {
        "category": "Computer Networks",
        "difficulty": "Beginner",
        "question_text": "Compare TCP and UDP protocols. What are the key tradeoffs between reliability and latency, and what are typical use cases for each?",
        "expected_concepts": ["connection-oriented vs connectionless", "guaranteed delivery, ordering, error checking in TCP", "low overhead, streaming/gaming/DNS in UDP", "handshake overhead"]
    },
    {
        "category": "Computer Networks",
        "difficulty": "Intermediate",
        "question_text": "Describe the complete TCP Three-Way Handshake and the Four-Way Termination handshake with their packet flags (SYN, ACK, FIN).",
        "expected_concepts": ["SYN (seq=x)", "SYN-ACK (seq=y, ack=x+1)", "ACK (ack=y+1)", "FIN and ACK sequence", "TIME_WAIT state purpose to avoid delayed duplicates"]
    },
    {
        "category": "Computer Networks",
        "difficulty": "Advanced",
        "question_text": "Walk through everything that happens from the moment a user types 'https://example.com' into their browser until the page renders, including DNS, TLS handshake, and HTTP/2 multiplexing.",
        "expected_concepts": ["DNS resolution hierarchy (recursive, root, TLD, authoritative)", "TCP handshake", "TLS 1.3 cryptographic key exchange (ClientHello, certificates, Diffie-Hellman)", "HTTP GET request/response", "browser DOM/CSSOM tree rendering"]
    },

    # 9. System Design
    {
        "category": "System Design",
        "difficulty": "Beginner",
        "question_text": "What is the difference between Vertical Scaling and Horizontal Scaling? What are the benefits and bottlenecks of each?",
        "expected_concepts": ["scale up (more RAM/CPU) vs scale out (more instances)", "single point of failure", "load balancers required for horizontal", "stateless architecture vs distributed state synchronization"]
    },
    {
        "category": "System Design",
        "difficulty": "Intermediate",
        "question_text": "Explain the CAP Theorem (Consistency, Availability, Partition Tolerance). Why is Partition Tolerance non-negotiable in distributed networks?",
        "expected_concepts": ["network partitions are inevitable across physical cables/servers", "CP tradeoff (return error/wait to preserve consistency)", "AP tradeoff (return stale data to preserve uptime)", "PACELC extension (latency vs consistency during normal state)"]
    },
    {
        "category": "System Design",
        "difficulty": "Advanced",
        "question_text": "Design a globally distributed URL Shortener service (like bit.ly). How would you handle high write throughput, collision-free short URLs, and low-latency redirections?",
        "expected_concepts": ["Base62 encoding (alphanumeric 62 chars)", "distributed ID generation (Snowflake or pre-allocated ranges)", "caching layer (Redis/Memcached with LRU)", "HTTP 301 vs 302 redirect tradeoffs", "database sharding and read replicas"]
    },

    # 10. General Technical Interview
    {
        "category": "General Technical Interview",
        "difficulty": "Beginner",
        "question_text": "How do you approach debugging a critical production bug when you are given limited logs and an unclear error message?",
        "expected_concepts": ["reproducing the issue locally/staging", "isolating variables and recent code deployments", "examining logs, metrics, stack traces", "scientific hypothesis testing", "post-mortem and defensive test creation"]
    },
    {
        "category": "General Technical Interview",
        "difficulty": "Intermediate",
        "question_text": "Explain the SOLID principles in software engineering with a brief explanation of how following them improves maintainability.",
        "expected_concepts": ["Single Responsibility", "Open/Closed (open for extension, closed for modification)", "Liskov Substitution", "Interface Segregation", "Dependency Inversion"]
    },
    {
        "category": "General Technical Interview",
        "difficulty": "Advanced",
        "question_text": "How do you design a robust CI/CD pipeline for microservices that balances developer velocity with safety against regression failures?",
        "expected_concepts": ["automated unit, integration, and contract tests", "containerization and immutable artifacts", "canary deployments / blue-green deployments", "automated rollback triggers based on error rate metrics", "feature flags"]
    }
]


def seed_questions(db_session):
    """Seed initial questions if none exist in the database."""
    from app.models.question import Question
    
    count = db_session.query(Question).count()
    if count == 0:
        for q_data in INITIAL_QUESTIONS:
            q = Question(
                question_text=q_data["question_text"],
                category=q_data["category"],
                difficulty=q_data["difficulty"],
                expected_concepts=q_data["expected_concepts"],
            )
            db_session.add(q)
        db_session.commit()
