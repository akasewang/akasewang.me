import type { TimelineItemProps } from '@/types/site'

/**
 * Certifications Data Dictionary.
 * Centralized static configuration and text definitions.
 */
export const certifications: TimelineItemProps[] = [
  {
    id: 'rust-programming-specialization',
    title: 'Rust Programming Specialization',
    startDate: '02.2026',
    links: [{ text: 'Duke University', url: 'https://www.duke.edu/', prefix: 'by' }],
    description: [
      'Mastered systems programming using Rust for high performance applications in cloud, DevOps and AI with Coursera.',
      '- [Rust Fundamentals](https://www.coursera.org/learn/rust-fundamentals) : Memory safety, ownership and borrowing.',
      '- [Data Engineering with Rust](https://www.coursera.org/learn/data-engineering-rust) : Building efficient data pipelines and CLI tools.',
      '- [Rust for DevOps](https://www.coursera.org/learn/rust-devops) : Containerization, CI/CD and automation.',
      '- [Python and Rust with Linux](https://www.coursera.org/learn/python-rust-linux-command-line-tools) : Integrating languages for performance.',
      '- [Rust for LLMOps](https://www.coursera.org/learn/rust-llm-operations) : Deploying large language models.',
    ],
    tech: ['Rust', 'DevOps', 'Cloud Computing', 'Data Engineering', 'LLMOps'],
  },
  {
    id: 'programming-with-google-go-specialization',
    title: 'Programming with Google Go Specialization',
    startDate: '01.2026',
    links: [{ text: 'UC Irvine', url: 'https://uci.edu/', prefix: 'by' }],
    description: [
      'Developed proficiency in creating concise and efficient applications using the Go programming language through Coursera.',
      '- [Getting Started with Go](https://www.coursera.org/learn/google-golang-getting-started) : Data types and RFCs.',
      '- [Functions and Interfaces](https://www.coursera.org/learn/google-golang-functions-methods) : Object oriented concepts and methods.',
      '- [Concurrency in Go](https://www.coursera.org/learn/google-golang-concurrency) : Channels and goroutines.',
    ],
    tech: ['Go', 'Concurrency', 'System Programming', 'Algorithms'],
  },
  {
    id: 'deeplearning-ai-data-engineering-specialization',
    title: 'Data Engineering Specialization',
    startDate: '06.2025',
    endDate: '08.2025',
    links: [
      {
        text: 'DeepLearning.AI',
        url: 'https://www.deeplearning.ai/',
        prefix: 'by',
      },
    ],
    description: [
      'Mastered the principles of effective data engineering and developed a framework for creating business value with data systems on AWS with Coursera.',
      '- [Introduction to Data Engineering](https://www.coursera.org/learn/introduction-to-data-engineering) : Deep dive into the data engineering lifecycle and system requirements.',
      '- [Source Systems, Ingestion and Pipelines](https://www.coursera.org/learn/source-systems-data-ingestion-pipelines) : Implementing batch and streaming ingestion on AWS.',
      '- [Data Storage and Queries](https://www.coursera.org/learn/data-storage-queries) : Designing storage architectures and selecting appropriate database technologies.',
      '- [Modeling, Transformation and Serving](https://www.coursera.org/learn/data-modeling-transformation-serving) : Processing data for analytics and machine learning pipelines.',
    ],
    tech: ['AWS', 'Python', 'Apache Spark', 'SQL', 'Data Pipelines'],
  },
  {
    id: 'deep-learning-specialization',
    title: 'Deep Learning Specialization',
    startDate: '02.2025',
    endDate: '04.2025',
    links: [
      {
        text: 'DeepLearning.AI',
        url: 'https://www.deeplearning.ai/',
        prefix: 'by',
      },
    ],
    description: [
      'Completed a comprehensive 5-course specialization on Coursera by DeepLearning.AI covering foundational and advanced neural network architectures.',
      '- [Neural Networks and Deep Learning](https://www.coursera.org/learn/neural-networks-deep-learning) : Built a neural network from scratch using Python and NumPy.',
      '- [Improving Deep Neural Networks](https://www.coursera.org/learn/deep-neural-network) : Hyperparameter tuning, L2 regularization, Dropout and optimization algorithms like Adam.',
      '- [Structuring Machine Learning Projects](https://www.coursera.org/learn/machine-learning-projects) : Strategies for error analysis, transfer learning and multi task learning.',
      '- [Convolutional Neural Networks](https://www.coursera.org/learn/convolutional-neural-networks) : Computer vision applications including object detection, YOLO and U-Net.',
      '- [Sequence Models](https://www.coursera.org/learn/nlp-sequence-models) : RNNs, LSTMs, GRUs and Transformer architectures for NLP.',
    ],
    tech: ['Python', 'TensorFlow', 'Neural Networks', 'Computer Vision', 'NLP'],
  },
  {
    id: 'machine-learning-specialization',
    title: 'Machine Learning Specialization',
    startDate: '01.2025',
    endDate: '04.2025',
    links: [
      {
        text: 'Stanford University',
        url: 'https://www.stanford.edu/',
        prefix: 'by',
      },
    ],
    description: [
      'A foundational program on Coursera by Andrew Ng covering core ML algorithms and real world AI applications.',
      '- [Supervised Machine Learning](https://www.coursera.org/learn/machine-learning) : Regression and classification.',
      '- [Advanced Learning Algorithms](https://www.coursera.org/learn/advanced-learning-algorithms) : Neural networks and decision trees.',
      '- [Unsupervised Learning](https://www.coursera.org/learn/unsupervised-learning-recommenders-reinforcement-learning) : Clustering and recommender systems.',
    ],
    tech: ['Scikit-Learn', 'TensorFlow', 'Python', 'Neural Networks', 'Clustering'],
  },
  {
    id: 'mathematics-for-machine-learning-and-data-science-specialization',
    title: 'Mathematics for Machine Learning and Data Science Specialization',
    startDate: '12.2024',
    endDate: '02.2025',
    links: [
      {
        text: 'DeepLearning.AI',
        url: 'https://www.deeplearning.ai/',
        prefix: 'by',
      },
    ],
    description: [
      'Mastered the mathematical toolkit essential for understanding and troubleshooting AI algorithms with Coursera.',
      '- [Linear Algebra](https://www.coursera.org/learn/linear-algebra-for-machine-learning-and-data-science) : Vectors, matrices and eigenvalues.',
      '- [Calculus](https://www.coursera.org/learn/calculus-for-machine-learning-and-data-science) : Derivatives, gradients and optimization.',
      '- [Probability and Statistics](https://www.coursera.org/learn/probability-and-statistics-for-machine-learning-and-data-science) : Distributions and hypothesis testing.',
    ],
    tech: ['Linear Algebra', 'Calculus', 'Statistics', 'NumPy', 'Optimization'],
  },
  {
    id: 'django-for-everybody-specialization',
    title: 'Django for Everybody Specialization',
    startDate: '10.2024',
    endDate: '01.2025',
    links: [
      {
        text: 'University of Michigan',
        url: 'https://umich.edu/',
        prefix: 'by',
      },
    ],
    description: [
      'Built and deployed full featured web applications using the Django library and Python through Coursera.',
      '- [Web Application Technologies](https://www.coursera.org/learn/django-database-abstract) : HTTP and HTML/CSS styling.',
      '- [Building Web Apps](https://www.coursera.org/learn/django-database-templates) : Models, templates and querysets.',
      '- [Django Features](https://www.coursera.org/learn/django-database-forms) : Sessions and forms.',
      '- [Developing and Deploying](https://www.coursera.org/learn/django-javascript-jquery-json) : JavaScript, jQuery and JSON integration.',
    ],
    tech: ['Django', 'Python', 'JavaScript', 'SQL', 'Application Deployment'],
  },
  {
    id: 'meta-front-end-developer-professional-certificate',
    title: 'Meta Front-End Developer Professional Certificate',
    startDate: '05.2024',
    endDate: '08.2024',
    links: [{ text: 'Meta', url: 'https://www.meta.com/en-gb/about/', prefix: 'by' }],
    description: [
      'Completed a 9-course professional certificate on Coursera by Meta covering the full front end development stack, from core web fundamentals to React and UX/UI design.',
      '- [Introduction to Front-End Development](https://www.coursera.org/learn/introduction-to-front-end-development) : HTML, CSS and UI frameworks overview.',
      '- [Programming with JavaScript](https://www.coursera.org/learn/programming-with-javascript) : JS basics, OOP, arrays and unit testing with Jest.',
      '- [Version Control](https://www.coursera.org/learn/introduction-to-version-control) : Git, GitHub and Linux command line.',
      '- [HTML and CSS in Depth](https://www.coursera.org/learn/html-and-css-in-depth) : Responsive layouts, Bootstrap and accessibility.',
      '- [React Basics](https://www.coursera.org/learn/react-basics) : Components, props, state and dynamic rendering.',
      '- [Advanced React](https://www.coursera.org/learn/advanced-react) : Reusable patterns, hooks, API integration and testing.',
      '- [Principles of UX/UI Design](https://www.coursera.org/learn/principles-of-ux-ui-design) : UX research, wireframing and prototyping in Figma.',
      '- [Capstone Project](https://www.coursera.org/learn/meta-front-end-developer-capstone) : Built a full responsive front end web app using React.',
      '- [Coding Interview Preparation](https://www.coursera.org/learn/coding-interview-preparation) : Algorithms, data structures and problem solving techniques.',
    ],
    tech: ['React', 'JavaScript', 'HTML/CSS', 'Git', 'Bootstrap', 'Figma'],
  },
  {
    id: 'postgresql-for-everybody-specialization',
    title: 'PostgreSQL for Everybody Specialization',
    startDate: '04.2024',
    endDate: '06.2024',
    links: [
      {
        text: 'University of Michigan',
        url: 'https://umich.edu/',
        prefix: 'by',
      },
    ],
    description: [
      'Mastered SQL and advanced database design using PostgreSQL for real world environments with Coursera.',
      '- [Database Design](https://www.coursera.org/learn/database-design-postgresql) : Basic SQL and CRUD operations.',
      '- [Intermediate PostgreSQL](https://www.coursera.org/learn/intermediate-postgresql) : Regular expressions and stored procedures.',
      '- [JSON and NLP](https://www.coursera.org/learn/postgresql-nlp-json) : Handling semi structured data.',
      '- [Architecture and NoSQL](https://www.coursera.org/learn/postgresql-architecture-nosql) : ACID versus BASE systems.',
    ],
    tech: ['PostgreSQL', 'SQL', 'Database Design', 'JSON', 'NoSQL'],
  },
  {
    id: 'python-for-everybody-specialization',
    title: 'Python for Everybody Specialization',
    startDate: '03.2024',
    endDate: '07.2024',
    links: [
      {
        text: 'University of Michigan',
        url: 'https://umich.edu/about/',
        prefix: 'by',
      },
    ],
    description: [
      'Completed a 5-course specialization on Coursera by University of Michigan covering Python from core fundamentals to real world data applications.',
      '- [Programming for Everybody](https://www.coursera.org/learn/python) : Python basics, variables, functions and loops.',
      '- [Python Data Structures](https://www.coursera.org/learn/python-data) : Lists, dictionaries, tuples and file I/O.',
      '- [Using Python to Access Web Data](https://www.coursera.org/learn/python-network-data) : Web scraping, XML, JSON and REST APIs.',
      '- [Using Databases with Python](https://www.coursera.org/learn/python-databases) : SQL, relational databases and OOP concepts.',
      '- [Capstone Project](https://www.coursera.org/learn/python-data-visualization) : Built an app for automated data retrieval, processing and visualization.',
    ],
    tech: ['Python', 'SQL', 'REST APIs', 'Web Scraping', 'Data Visualization'],
  },
  {
    id: 'algorithms-specialization',
    title: 'Algorithms Specialization',
    startDate: '02.2024',
    endDate: '05.2024',
    links: [
      {
        text: 'Stanford University',
        url: 'https://www.stanford.edu/',
        prefix: 'by',
      },
    ],
    description: [
      'Conducted a rigorous study of the design and analysis of algorithms focused on conceptual understanding with Coursera.',
      '- [Divide and Conquer](https://www.coursera.org/learn/algorithms-divide-conquer) : Sorting and searching.',
      '- [Graph Search](https://www.coursera.org/learn/algorithms-graphs-data-structures) : Shortest paths and data structures.',
      '- [Greedy Algorithms](https://www.coursera.org/learn/algorithms-greedy) : Dynamic programming and MSTs.',
      '- [Shortest Paths](https://www.coursera.org/learn/algorithms-npcomplete) : NP-completeness and heuristics.',
    ],
    tech: ['Algorithms', 'Data Structures', 'Graph Theory', 'Dynamic Programming'],
  },
]
