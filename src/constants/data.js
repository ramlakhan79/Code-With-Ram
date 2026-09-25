import Dailyquotes from "../components/Dailyquotes";
import * as Icons from "../components/Icons";

export const navMenu = [
  {
    id: "Home",
    href: "/",
  },
  // {
  //   id: "About",
  //   href: "/about",
  // },
  // {
  //   id: "Resume",
  //   href: "/resume",
  // },
  // {
  //   id: "Services",
  //   href: "/services",
  // },
  {
    id: "Blogs",
    href: "/blogs",
  },
  {
    id: "Profile",
    href: "/profile",
  },
  // {
  //   id: "Coding",
  //   href: "/coding",
  // },
];

export const projects = [
  // {
  //   title: "My Personal Portfolio",
  //   src: "/assets/images/projects/portfolio.png",
  //   altText: "Screenshot of Portfolio home page",
  //   ariaLabel:
  //     "Opens modal window with more information about the My Personal Portfolio web project",
  //   details: {
  //     description:
  //       "Welcome to Ramlakhan, where innovation meets expertise. Based in the web technologies, our portfolio showcases a diverse range of web development projects and services, each reflecting our commitment to quality, creativity, and client satisfaction. Whether you're looking for a sleek business website, a dynamic e-commerce platform, or a custom web application, our portfolio has something for you.",
  //     technologies: [
  //       {
  //         title: "HTML",
  //         Icon: Icons.HtmlIcon,
  //       },
  //       {
  //         title: "CSS",
  //         Icon: Icons.CSSIcon,
  //       },
  //       {
  //         title: "JavaScript",
  //         Icon: Icons.JavascriptIcon,
  //       },
  //     ],
  //     url: "https://ramlakhan130.netlify.app/",
  //     githubUrl: null,
  //   },
  // },

  // {
  //   title: "SISTec ERP Clone",
  //   src: "/assets/images/projects/sistecerp.png",
  //   altText: "Screenshot of SISTec ERP home page",
  //   ariaLabel:
  //     "Opens modal window with more information about the SISTec ERP project",
  //   details: {
  //     description:
  //       "A SISTec ERP application  is used to students can track their records like attendance, fees, and class schedule.",
  //     technologies: [
  //       {
  //         title: "HTML",
  //         Icon: Icons.HtmlIcon,
  //       },
  //       {
  //         title: "CSS",
  //         Icon: Icons.CSSIcon,
  //       },
  //       {
  //         title: "JavaScript",
  //         Icon: Icons.JavascriptIcon,
  //       },

  //     ],
  //     url: null,
  //     githubUrl: null,
  //   },
  // },

  // {
  //   title: "3D Calculator",
  //   src: "/assets/images/projects/calculator.png",
  //   altText: "Screenshot of 3D Calculator home page",
  //   ariaLabel:
  //     "Opens modal window with more information about the 3D Calculator project",
  //   details: {
  //     description:
  //       "A 3D Calculator application enables real-time calculation of addition, division, multiplication and subtraction etc. It typically includes features like addition, division, multiplication and subtraction.",
  //     technologies: [
  //       {
  //         title: "HTML",
  //         Icon: Icons.HtmlIcon,
  //       },
  //       {
  //         title: "CSS",
  //         Icon: Icons.CSSIcon,
  //       },
  //     ],
  //     url: "https://3dcalculator130.netlify.app/",
  //     githubUrl: null,
  //   },
  // },

  // {
  //   title: "Temperature Convertor",
  //   src: "/assets/images/projects/temperature.png",
  //   altText: "Screenshot of Temperature Convertor home page",
  //   ariaLabel:
  //     "Opens modal window with more information about the Temperature Convertor project",
  //   details: {
  //     description:
  //       "A Temprature Convertor application  is convert the temperature.",
  //     technologies: [
  //       {
  //         title: "HTML",
  //         Icon: Icons.HtmlIcon,
  //       },
  //       {
  //         title: "CSS",
  //         Icon: Icons.CSSIcon,
  //       },
  //     ],
  //     url: "https://temperature.netlify.app/",
  //     githubUrl: null,
  //   },
  // },

  {
    title: "Chat Web Application",
    src: "/assets/images/projects/chitchat.png",
    altText: "Screenshot of chat web application home page",
    ariaLabel:
      "Opens modal window with more information about the chat web project",
    details: {
      description:
        "A chat web application enables real-time communication between users through text-based messages. It typically includes features like message history, user authentication, notifications, and group chats, providing a seamless and interactive platform for conversation and collaboration.",
      technologies: [
        {
          title: "MongoDB",
          Icon: Icons.MongoDBIcon,
        },
        {
          title: "ExpressJS",
          Icon: Icons.ExpressJSIcon,
        },
        {
          title: "React",
          Icon: Icons.ReactIcon,
        },
        {
          title: "NodeJS",
          Icon: Icons.NodeJSIcon,
        },
      ],
      url: "https://chitchat-165i.onrender.com/",
      githubUrl: "https://github.com/ramlakhan79/Chat-Web-Application",
    },
  },

  {
    title: "Quiz Web Application",
    src: "/assets/images/projects/quizweb.png",
    altText: "Screenshot of Quiz web home page",
    ariaLabel:
      "Opens modal window with more information about the quiz web project",
    details: {
      description:
        "A quiz web application allows users to take interactive quizzes on various topics. It typically offers multiple-choice questions, real-time scoring, and results analysis. Features may include timed quizzes, leaderboards, personalized question sets, and social sharing, creating an engaging and educational experience for users.",
      technologies: [
        {
          title: "MongoDB",
          Icon: Icons.MongoDBIcon,
        },
        {
          title: "ExpressJS",
          Icon: Icons.ExpressJSIcon,
        },
        {
          title: "React",
          Icon: Icons.ReactIcon,
        },
        {
          title: "NodeJS",
          Icon: Icons.NodeJSIcon,
        },
      ],
      url: "https://quiz-web-app-khaki.vercel.app/",
      githubUrl: "https://github.com/ramlakhan79/Quiz-Web-App",
    },
  },
];

export const blogs = [
  {
    id: 1,
    image: "https://via.placeholder.com/1200x800",
    title: "Understanding React Server Components",
    desc: "React Server Components (RSC) introduce a different way of thinking about rendering. Instead of sending all the JavaScript to the browser, React can now handle part of the work on the server. This reduces bundle size and improves performance, especially for users on slow networks.\n\nThe biggest advantage is that server-only code never ships to the client. That means you can directly read files, query databases, or perform expensive operations without worrying about exposing credentials or impacting performance. The server prepares the UI and sends a lightweight version to the browser.\n\nAnother meaningful improvement is how RSC work with data fetching. Instead of using useEffect or client-side fetching libraries, components can fetch data on the server before rendering. This results in cleaner code and fewer network waterfalls.\n\nRSC also pair well with streaming. The server can send parts of the UI as they are ready, which gives users a faster-feeling interface. Instead of waiting for one big response, the page loads gradually.\n\nHowever, RSC aren’t a drop-in replacement for traditional components. Client-side interactivity still needs Client Components. The key is knowing when to use each. For example, forms, animations, and event-driven elements belong on the client. Anything related to data loading or heavy computation belongs on the server.\n\nRSC create a modern balance between performance and developer experience. They give you tools to build faster apps without complex setup.",
    date: "Dec 04, 2025",
    category: "React",
    read: "5 min",
    tags: ["React", "Performance"],
  },

  {
    id: 2,
    image: "https://via.placeholder.com/1200x800",
    title: "When To Use useMemo and useCallback",
    desc: "useMemo and useCallback are helpful, but many developers use them without fully understanding when they make sense. Both hooks reduce unnecessary re-renders, but they also add some overhead. The trick is knowing when the trade-off is worth it.\n\nuseMemo stores the result of an expensive calculation. Instead of running a heavy function on every render, React reuses the previously calculated value as long as the dependencies haven’t changed. This is useful when you’re working with large arrays, sorting data, computing derived values, or performing operations that take noticeable time.\n\nuseCallback works similarly, but it memorizes a function instead of a value. It’s especially helpful when passing functions as props to child components. Without useCallback, React creates a new function on each render, which might cause the child to re-render even if nothing changed.\n\nIt’s important not to wrap every function or calculation in these hooks. If the logic is simple, the cost of recalculating is lower than the cost of storing it.\n\nA good rule is: use these hooks when you notice performance issues, when the component re-renders too often, or when working with large data sets. Used properly, they help apps feel smoother and more efficient.",
    date: "Dec 05, 2025",
    category: "React",
    read: "4 min",
    tags: ["React", "Hooks"],
  },

  {
    id: 3,
    image: "https://via.placeholder.com/1200x800",
    title: "A Practical Guide to Reusable React Components",
    desc: "Reusable components save time, reduce bugs, and keep code cleaner. The goal isn’t to build something extremely generic. It's to design components that cover common use cases without becoming too complex.\n\nStart with small building blocks. Buttons, inputs, cards, and modals are good examples. These can often accept a mix of props like size, color, disabled, or variant. Keep the API predictable so developers understand what to expect.\n\nFor components with more structure, like forms or layouts, consider using the composition pattern. Instead of giving dozens of props, let developers pass their own elements into the component. This gives more flexibility and keeps your code easier to maintain.\n\nStyling also matters. Tailwind helps by providing utility classes, but you can still expose className for customization. Avoid hardcoding spacing or colors that can't be changed.\n\nA reusable component should hide complexity and expose only what’s required. You don’t want developers to think about how it works internally. They should only care about how to use it.\n\nFinally, document everything. Even simple components benefit from examples. Reusability increases when people know how to use the component without guessing.",
    date: "Dec 06, 2025",
    category: "React",
    read: "6 min",
    tags: ["React", "UI"],
  },

  {
    id: 4,
    image: "https://via.placeholder.com/1200x800",
    title: "Async/Await in JavaScript: Beyond the Basics",
    desc: "Async and await make asynchronous code easier to read, but there's more going on behind the scenes. When you mark a function as async, JavaScript wraps the return value in a promise. Using await pauses code execution in that function until the promise settles.\n\nOne common mistake is forgetting that await only blocks the current async function, not the rest of the program. JavaScript still runs other operations while waiting.\n\nAnother area developers overlook is error handling. Try/catch works well, but it can get messy when dealing with multiple async operations. Promise.all helps when tasks can run in parallel, but you need to consider what happens if one of them fails.\n\nAsync functions tie directly into the event loop. Promises resolve in the microtask queue, which runs before regular tasks. Understanding this helps you debug timing issues, especially when working with UI updates or repeated network calls.\n\nYou should also avoid awaiting things inside loops unless absolutely necessary. Running asynchronous tasks sequentially slows everything down. Instead, collect promises and wait for them together.\n\nAsync/await simplifies your code, but using it correctly makes your applications smoother, faster, and easier to reason about.",
    date: "Dec 07, 2025",
    category: "JavaScript",
    read: "5 min",
    tags: ["JavaScript", "Async"],
  },

  {
    id: 5,
    image: "https://via.placeholder.com/1200x800",
    title: "Understanding Closures With Real Examples",
    desc: "Closures allow a function to remember values from its parent scope even after that parent function has finished running. This simple idea powers many useful JavaScript patterns.\n\nA common example is a function that returns another function. The inner function can still access variables defined outside of it.\n\nClosures are also used in event handlers. When you attach a listener inside a loop, closures help you preserve the correct values.\n\nAnother practical use is function factories. You can create small reusable functions that share logic. Memoization is another area where closures shine. You store previous results inside a closed-over scope so the function can return cached values faster.\n\nClosures can cause memory issues if not used carefully. Unintentionally capturing large objects or DOM references keeps them in memory longer than needed.\n\nOnce you understand closures, patterns like currying, debounce, and throttle become easier to grasp. They are not just a theoretical concept — they solve real problems in everyday JavaScript.",
    date: "Dec 08, 2025",
    category: "JavaScript",
    read: "4 min",
    tags: ["JavaScript", "Functions"],
  },

  {
    id: 6,
    image: "https://via.placeholder.com/1200x800",
    title: "Migrating From Webpack to Vite",
    desc: "Moving from Webpack to Vite improves development speed and cuts down configuration time. Vite is built around native ES modules and uses a faster build pipeline.\n\nThe development server is where you feel the biggest difference. Webpack rebuilds and bundles everything on file changes. Vite only updates the modules that changed, making the refresh almost instant.\n\nMigrating usually starts with moving your entry file, adjusting alias settings, and replacing loaders with Vite plugins. Since Vite uses Rollup under the hood for production builds, you gain efficient tree-shaking and clean output bundles.\n\nOne thing to consider is plugin compatibility. Some Webpack plugins won’t work directly, but Vite has a large plugin ecosystem that covers most use cases.\n\nWith Vite, you also get first-class TypeScript support, faster HMR, and simpler configuration. The developer experience improves immediately.",
    date: "Dec 09, 2025",
    category: "Build Tools",
    read: "6 min",
    tags: ["Vite", "Webpack"],
  },

  {
    id: 7,
    image: "https://via.placeholder.com/1200x800",
    title: "How Vite Handles Production Bundling",
    desc: "Vite uses Rollup internally when creating a production bundle. Rollup focuses on ES modules, which lets it perform effective tree-shaking. This removes unused code and keeps the bundle smaller.\n\nThe bundling steps include dependency pre-bundling, code splitting, asset optimization, and generating separate chunks for libraries. Vite also handles dynamic imports cleanly.\n\nFor CSS, Vite extracts styles and minimizes them. Image assets get hashed names to improve caching.\n\nThe outcome is a faster, stable build with predictable output.",
    date: "Dec 10, 2025",
    category: "Build Tools",
    read: "4 min",
    tags: ["Vite", "Rollup"],
  },

  {
    id: 8,
    image: "https://via.placeholder.com/1200x800",
    title: "ESBuild vs SWC vs Babel",
    desc: "JavaScript tooling has evolved quickly, and three major players stand out today: ESBuild, SWC, and Babel. They serve similar roles but excel in different areas.\n\nESBuild is written in Go and is extremely fast. It's great for development environments, quick builds, and lightweight tooling. However, its plugin ecosystem is smaller.\n\nSWC is written in Rust and aims to replace Babel. It’s faster than Babel and supports most modern JavaScript features. Many bundlers now use it.\n\nBabel offers the most mature plugin system and transformations. If you need fine-grained control over your output or use cutting-edge syntax transformation, Babel still leads.\n\nChoosing between them depends on your project: speed, flexibility, and ecosystem matter differently in each case.",
    date: "Dec 11, 2025",
    category: "Build Tools",
    read: "5 min",
    tags: ["ESBuild", "SWC", "Babel"],
  },
];


export const quoteUpdate = [
  {
    dayq: 1,
    dailyquotes: [
      {
        quote: "Writing is its own reward.",
        name: "--Henry Miller",
        title: "Author",
        src: "/assets/images/testimonials/testimo.png",
        altText: "Profile of Henry Miller",
      },
    ],
  },
  {
    dayq: 2,
    dailyquotes: [
      {
        quote:
          "Success is not the key to happiness. Happiness is the key to success.",
        name: "--Albert Schweitzer",
        title: "Philosopher",
        src: "/assets/images/testimonials/albert-schweitzer.png",
        altText: "Profile of Albert Schweitzer",
      },
    ],
  },
  {
    dayq: 3,
    dailyquotes: [
      {
        quote:
          "Your time is limited, so don't waste it living someone else's life.",
        name: "--Steve Jobs",
        title: "Apple Co-Founder",
        src: "/assets/images/testimonials/steve-jobs.png",
        altText: "Profile of Steve Jobs",
      },
    ],
  },
  {
    dayq: 4,
    dailyquotes: [
      {
        quote: "Creativity is intelligence having fun.",
        name: "--Albert Einstein",
        title: "Physicist",
        src: "/assets/images/testimonials/albert-einstein.png",
        altText: "Profile of Albert Einstein",
      },
    ],
  },
  {
    dayq: 5,
    dailyquotes: [
      {
        quote: "In the middle of difficulty lies opportunity.",
        name: "--Albert Einstein",
        title: "Physicist",
        src: "/assets/images/testimonials/albert-einstein.png",
        altText: "Profile of Albert Einstein",
      },
    ],
  },
  {
    dayq: 6,
    dailyquotes: [
      {
        quote:
          "The only limit to our realization of tomorrow is our doubts of today.",
        name: "--Franklin D. Roosevelt",
        title: "Former US President",
        src: "/assets/images/testimonials/fdr.png",
        altText: "Profile of Franklin D. Roosevelt",
      },
    ],
  },
  {
    dayq: 7,
    dailyquotes: [
      {
        quote:
          "It does not matter how slowly you go as long as you do not stop.",
        name: "--Confucius",
        title: "Philosopher",
        src: "/assets/images/testimonials/confucius.png",
        altText: "Profile of Confucius",
      },
    ],
  },
  {
    dayq: 8,
    dailyquotes: [
      {
        quote: "The best way to predict your future is to create it.",
        name: "--Peter Drucker",
        title: "Management Consultant",
        src: "/assets/images/testimonials/peter-drucker.png",
        altText: "Profile of Peter Drucker",
      },
    ],
  },
  {
    dayq: 9,
    dailyquotes: [
      {
        quote: "Don't watch the clock; do what it does. Keep going.",
        name: "--Sam Levenson",
        title: "Writer",
        src: "/assets/images/testimonials/sam-levenson.png",
        altText: "Profile of Sam Levenson",
      },
    ],
  },
  {
    dayq: 10,
    dailyquotes: [
      {
        quote:
          "I have not failed. I've just found 10,000 ways that won't work.",
        name: "--Thomas Edison",
        title: "Inventor",
        src: "/assets/images/testimonials/thomas-edison.png",
        altText: "Profile of Thomas Edison",
      },
    ],
  },
  {
    dayq: 11,
    dailyquotes: [
      {
        quote:
          "Success is walking from failure to failure with no loss of enthusiasm.",
        name: "--Winston Churchill",
        title: "Former UK Prime Minister",
        src: "/assets/images/testimonials/winston-churchill.png",
        altText: "Profile of Winston Churchill",
      },
    ],
  },
  {
    dayq: 12,
    dailyquotes: [
      {
        quote:
          "Whether you think you can or you think you can't, you're right.",
        name: "--Henry Ford",
        title: "Automaker",
        src: "/assets/images/testimonials/henry-ford.png",
        altText: "Profile of Henry Ford",
      },
    ],
  },
  {
    dayq: 13,
    dailyquotes: [
      {
        quote: "The journey of a thousand miles begins with one step.",
        name: "--Lao Tzu",
        title: "Philosopher",
        src: "/assets/images/testimonials/lao-tzu.png",
        altText: "Profile of Lao Tzu",
      },
    ],
  },
  {
    dayq: 14,
    dailyquotes: [
      {
        quote: "It always seems impossible until it's done.",
        name: "--Nelson Mandela",
        title: "Former South African President",
        src: "/assets/images/testimonials/nelson-mandela.png",
        altText: "Profile of Nelson Mandela",
      },
    ],
  },
  {
    dayq: 15,
    dailyquotes: [
      {
        quote:
          "The greatest glory in living lies not in never falling, but in rising every time we fall.",
        name: "--Nelson Mandela",
        title: "Former South African President",
        src: "/assets/images/testimonials/nelson-mandela.png",
        altText: "Profile of Nelson Mandela",
      },
    ],
  },
  {
    dayq: 16,
    dailyquotes: [
      {
        quote: "If you want to achieve greatness, stop asking for permission.",
        name: "--Anonymous",
        title: "Unknown",
        src: "/assets/images/testimonials/anonymous.png",
        altText: "Profile of Anonymous",
      },
    ],
  },
  {
    dayq: 17,
    dailyquotes: [
      {
        quote: "You miss 100% of the shots you don't take.",
        name: "--Wayne Gretzky",
        title: "Hockey Player",
        src: "/assets/images/testimonials/wayne-gretzky.png",
        altText: "Profile of Wayne Gretzky",
      },
    ],
  },
  {
    dayq: 18,
    dailyquotes: [
      {
        quote: "Believe you can and you're halfway there.",
        name: "--Theodore Roosevelt",
        title: "Former US President",
        src: "/assets/images/testimonials/theodore-roosevelt.png",
        altText: "Profile of Theodore Roosevelt",
      },
    ],
  },
  {
    dayq: 19,
    dailyquotes: [
      {
        quote:
          "Perfection is not attainable, but if we chase perfection we can catch excellence.",
        name: "--Vince Lombardi",
        title: "Football Coach",
        src: "/assets/images/testimonials/vince-lombardi.png",
        altText: "Profile of Vince Lombardi",
      },
    ],
  },
  {
    dayq: 20,
    dailyquotes: [
      {
        quote: "Act as if what you do makes a difference. It does.",
        name: "--William James",
        title: "Psychologist",
        src: "/assets/images/testimonials/william-james.png",
        altText: "Profile of William James",
      },
    ],
  },
  {
    dayq: 21,
    dailyquotes: [
      {
        quote: "The future depends on what you do today.",
        name: "--Mahatma Gandhi",
        title: "Indian Leader",
        src: "/assets/images/testimonials/gandhi.png",
        altText: "Profile of Mahatma Gandhi",
      },
    ],
  },
  {
    dayq: 22,
    dailyquotes: [
      {
        quote: "It is never too late to be what you might have been.",
        name: "--George Eliot",
        title: "Author",
        src: "/assets/images/testimonials/george-eliot.png",
        altText: "Profile of George Eliot",
      },
    ],
  },
  {
    dayq: 23,
    dailyquotes: [
      {
        quote: "Do what you can, with what you have, where you are.",
        name: "--Theodore Roosevelt",
        title: "Former US President",
        src: "/assets/images/testimonials/theodore-roosevelt.png",
        altText: "Profile of Theodore Roosevelt",
      },
    ],
  },
  {
    dayq: 24,
    dailyquotes: [
      {
        quote: "Dream big and dare to fail.",
        name: "--Norman Vaughan",
        title: "Explorer",
        src: "/assets/images/testimonials/norman-vaughan.png",
        altText: "Profile of Norman Vaughan",
      },
    ],
  },
  {
    dayq: 25,
    dailyquotes: [
      {
        quote: "The way to get started is to quit talking and begin doing.",
        name: "--Walt Disney",
        title: "Animator",
        src: "/assets/images/testimonials/walt-disney.png",
        altText: "Profile of Walt Disney",
      },
    ],
  },
  {
    dayq: 26,
    dailyquotes: [
      {
        quote: "Opportunities don't happen, you create them.",
        name: "--Chris Grosser",
        title: "Entrepreneur",
        src: "/assets/images/testimonials/chris-grosser.png",
        altText: "Profile of Chris Grosser",
      },
    ],
  },
  {
    dayq: 27,
    dailyquotes: [
      {
        quote: "To live a creative life, we must lose our fear of being wrong.",
        name: "--Joseph Chilton Pearce",
        title: "Author",
        src: "/assets/images/testimonials/joseph-chilton-pearce.png",
        altText: "Profile of Joseph Chilton Pearce",
      },
    ],
  },
  {
    dayq: 28,
    dailyquotes: [
      {
        quote:
          "It's not whether you get knocked down; it's whether you get up.",
        name: "--Vince Lombardi",
        title: "Football Coach",
        src: "/assets/images/testimonials/vince-lombardi.png",
        altText: "Profile of Vince Lombardi",
      },
    ],
  },
  {
    dayq: 29,
    dailyquotes: [
      {
        quote: "Strive not to be a success, but rather to be of value.",
        name: "--Albert Einstein",
        title: "Physicist",
        src: "/assets/images/testimonials/albert-einstein.png",
        altText: "Profile of Albert Einstein",
      },
    ],
  },
  {
    dayq: 30,
    dailyquotes: [
      {
        quote:
          "What you get by achieving your goals is not as important as what you become by achieving them.",
        name: "--Zig Ziglar",
        title: "Motivational Speaker",
        src: "/assets/images/testimonials/zig-ziglar.png",
        altText: "Profile of Zig Ziglar",
      },
    ],
  },
  {
    dayq: 31,
    dailyquotes: [
      {
        quote:
          "Your life does not get better by chance, it gets better by change.",
        name: "--Jim Rohn",
        title: "Motivational Speaker",
        src: "/assets/images/testimonials/jim-rohn.png",
        altText: "Profile of Jim Rohn",
      },
    ],
  },
];

export const testimonials = [
  {
    quote:
      "I am incredibly grateful for Ramlakhan remarkable efforts of completely revamping our nonprofit's website. His dedication and expertise in enhancing the site's security measures while also ensuring a seamless user experience has been nothing short of exceptional. The new website not only boasts a robust security infrastructure that safeguards sensitive data, but it also welcomes visitors with an intuitive and user-friendly interface. Ramlakhan took our organization's mission to heart and translated it into an online platform that not only represents our values but also engages our audience effectively. His selfless commitment to improving our online presence has undoubtedly elevated our nonprofit's reach and impact. We owe him a debt of gratitude for his invaluable contribution in making our website a secure and inviting space for all.",
    name: "Lakhan L.",
    title: "Executive Director of Web Technologies Organization",
    src: "/assets/images/testimonials/testimo.png",
    altText: "Profile of Lakhan L.",
  },
];

export const socialMedias = [
  {
    href: "mailto:ramlakhanlodhi229@gmail.com",
    ariaLabel: "Compose an email to Ramlakhan",
    title: "Write an Email to Ramlakhan",
    Icon: Icons.EmailIcon,
  },
  {
    href: "https://www.linkedin.com/in/ramlakhanlodhi/",
    ariaLabel: "Goes to Ramlakhan&apos;s LinkedIn profile",
    title: "LinkedIn Profile",
    Icon: Icons.LinkedInIcon,
  },
  {
    href: "https://github.com/ramlakhan79",
    ariaLabel: "Goes to Ramlakhan&apos;s GitHub profile",
    title: "GitHub Profile",
    Icon: Icons.GitHubIcon,
  },
  {
    href: "https://twitter.com/RamlakhanLodh18",
    ariaLabel: "Goes to Ramlakhan&apos;s Twitter profile",
    title: "Twitter Profile",
    Icon: Icons.TwitterIcon,
  },
];

export const techSkills = [
  {
    category: "Programming Languages",
    skills: [
      {
        title: "C",
        Icon: Icons.CIcon,
        url: null,
      },
      {
        title: "C++",
        Icon: Icons.CPPIcon,
        url: null,
      },

      {
        title: "Java",
        Icon: Icons.JavaIcon,
        url: null,
      },
      {
        title: "ABAP",
        Icon: Icons.AbapIcon,
        url: null,
      },
    ],
  },

  {
    category: "Coding Profile",
    skills: [
      {
        title: "LeetCode",
        Icon: Icons.LCIcon,
        url: "https://leetcode.com/u/Ramlakhan_79/",
      },
      {
        title: "CodeChef",
        Icon: Icons.CCIcon,
        url: "https://www.codechef.com/users/ramlakhan799",
      },

      {
        title: "Geeksforgeeks",
        Icon: Icons.GFGIcon,
        url: "https://www.geeksforgeeks.org/user/ramlakhan79/",
      },
    ],
  },

  {
    category: "Front-End Development",
    skills: [
      {
        title: "HTML",
        Icon: Icons.HtmlIcon,
        url: null,
      },
      {
        title: "CSS",
        Icon: Icons.CSSIcon,
        url: null,
      },
      {
        title: "Tailwind CSS",
        Icon: Icons.TailwindCSSIcon,
        url: null,
      },
      {
        title: "JavaScript",
        Icon: Icons.JavascriptIcon,
        url: null,
      },
      {
        title: "React",
        Icon: Icons.ReactIcon,
        url: null,
      },
      {
        title: "SAP UI5",
        Icon: Icons.Ui5Icon,
        url: null,
      },
    ],
  },
  {
    category: "Back-End Development",
    skills: [
      {
        title: "MongoDB",
        Icon: Icons.MongoDBIcon,
        url: null,
      },
      {
        title: "ExpressJS",
        Icon: Icons.ExpressJSIcon,
        url: null,
      },
      {
        title: "NodeJS",
        Icon: Icons.NodeJSIcon,
        url: null,
      },
      {
        title: "SQL Server",
        Icon: Icons.SqlServerIcon,
        url: null,
      },
    ],
  },

  {
    category: "CS Fundamentals",
    skills: [
      {
        title: "DBMS",
        Icon: Icons.DBMSIcon,
        url: null,
      },
      {
        title: "OS",
        Icon: Icons.OSIcon,
        url: null,
      },
      {
        title: "OOPM",
        Icon: Icons.OOPMIcon,
        url: null,
      },
    ],
  },

  {
    category: "Build Tools, Frameworks, and Versioning",
    skills: [
      {
        title: "Vite",
        Icon: Icons.ViteIcon,
        url: null,
      },
      {
        title: "Git",
        Icon: Icons.GitIcon,
        url: null,
      },
      {
        title: "GitHub",
        Icon: Icons.GitHubIcon,
        url: null,
      },
    ],
  },
  {
    category: "Design and Prototyping",
    skills: [
      {
        title: "Responsive Design",
        Icon: Icons.ResponsiveDesignIcon,
        url: null,
      },
      // {
      //   title: "Pen and Paper",
      //   Icon: Icons.SketchingIcon,
      // },
      {
        title: "Figma",
        Icon: Icons.FigmaIcon,
        url: null,
      },
    ],
  },

  // {
  //   category: "Content Management Systems",
  //   skills: [
  //     {
  //       title: "WordPress",
  //       Icon: Icons.WordPressIcon,
  //     },
  //   ],
  // },

  // {
  //   category: "Microsoft Products",
  //   skills: [
  //     {
  //       title: "Access",
  //       Icon: Icons.AccessIcon,
  //     },
  //   ],
  // },
  {
    category: "Others",
    skills: [
      {
        title: "APIs",
        Icon: Icons.APIIcon,
        url: null,
      },
      {
        title: "REST APIs",
        Icon: Icons.RestAPIIcon,
        url: null,
      },
    ],
  },
];

export const softSkills = [
  {
    title: "Creativity",
    Icon: Icons.BrightIdeaIcon,
  },
  {
    title: "Teamwork",
    Icon: Icons.TeamworkIcon,
  },
  {
    title: "Time Management",
    Icon: Icons.ScheduleIcon,
  },
];

export const workExp = [
  {
    company: "Maventic",
    location: "Bhopal, India",
    positions: [
      {
        title: "Associate Software Engineer",
        startDate: new Date(2025, 6),
        endDate: "Present",
      },
    ],
    tasks: [
      "Collaborate directly with clients to gather project requirements, provide regular updates, and deliver solutions that tailored to their specific needs",
      "Conduct competitor analysis to identify clients' opportunities for differentiation and growth",
      "Setup API calls and database structures for streamlining clients' business requirements",
      // "Demonstrate expertise in designing custom WordPress themes and plugins in PHP, enhancing website functionality and user interactivity",
    ],
  },
  {
    company: "Maventic",
    location: "Bhopal, India",
    positions: [
      {
        title: "Trainee Developer",
        startDate: new Date(2025, 0),
        endDate: new Date(2025, 5),
      },
    ],
    tasks: [
      "Designed and developed a responsive Taxi Booking web application using SAP UI5, enhancing user experience across devices.",
      "Implemented booking and ride history features by integrating SAP backend using ABAP and OData services, ensuring smooth data flow and improved user engagement.",
      "Built user dashboards for customers and drivers to manage profiles, view ride history, and track current bookings with intuitive UI components.",
      "Incorporated dark mode toggle and other UI enhancements to improve accessibility and user satisfaction.",
      "Tech Stack: ABAP, OData, SAP UI5.",
      // "Collaborate directly with clients to gather project requirements, provide regular updates, and deliver solutions that tailored to their specific needs",
      // "Conduct competitor analysis to identify clients' opportunities for differentiation and growth",
      // "Setup API calls and database structures for streamlining clients' business requirements",
      // "Demonstrate expertise in designing custom WordPress themes and plugins in PHP, enhancing website functionality and user interactivity",
    ],
  },
];

export const extracurriculars = [
  // {
  //     company: 'Literacy Bhopal',
  //     location: 'East Bhopal, India',
  //     positions: [
  //         {
  //             title: 'Digital Volunteer',
  //             startDate: new Date(2022, 3),
  //             endDate: new Date(2023, 9),
  //         },
  //     ],
  //     tasks: [
  //         "Diagnose and troubleshoot technical problems",
  //         "Demonstrate strong communication skills by explaining technical concepts in a clear and understandable manner",
  //         "Recognized for outstanding problem-solving capabilities",
  //     ],
  // },
];

export const educations = [
  {
    degree: "B.Tech",
    school: "Sagar Institute of Science and Technology, Bhopal",
    startDate: new Date(2021, 8),
    endDate: new Date(2025, 4),
    location: "Bhopal, India",
  },
  {
    degree: "12th Class",
    school: "Govt. Boys Higher Secondary School, Madhusudangarh",
    startDate: new Date(2020, 8),
    endDate: new Date(2021, 4),
    location: "Guna, India",
  },
  {
    degree: "10th Class",
    school: "Govt. High School, Ukawad",
    startDate: new Date(2018, 8),
    endDate: new Date(2019, 4),
    location: "Guna, India",
  },
];

export const dessertImages = [
  {
    src: "/assets/images/desserts/picture1.jpg",
    altText: "to be writing",
    value: "Picture1",
    label: "Picture1",
  },
  {
    src: "/assets/images/desserts/picture2.jpg",
    altText: "to be writing",
    value: "Picture2",
    label: "Picture2",
  },
  {
    src: "/assets/images/desserts/picture3.jpg",
    altText: "to be writing",
    value: "Picture3",
    label: " Picture3",
  },
  {
    src: "/assets/images/desserts/picture4.jpg",
    altText: "to be writing",
    value: "Picture4",
    label: "Picture4",
  },
  {
    src: "/assets/images/desserts/picture5.jpg",
    altText: "to be writing",
    value: "Pictures5",
    label: "Pictures5",
  },
  {
    src: "/assets/images/desserts/picture6.jpg",
    altText: "to be writing",
    value: "Picture6",
    label: "Picture6",
  },
];

export const generalServices = [
  // {
  //     title: 'Consulting and Strategy',
  //     description: "I work closely alongside you to understand your goals, target audience, and business objectives. Using this insight, I develop a strategic plan designed to seamlessly transform your goals into a captivating digital presence.",
  //     Icon: Icons.HandshakeIcon,
  // },
  // {
  //     title: 'Branding',
  //     description: "Let's craft a distinctive visual identity that resonates with your brand. An identity that not only establishes a strong visual presence, but also forges a profound connection with your audience, fostering a sense of trust and authenticity.",
  //     Icon: Icons.BrightIdeaIcon,
  // },
  // {
  //     title: 'Competitor Analysis',
  //     description: "Through my competitor analysis service, I delve deep into the strategies employed within your industry or niche. Armed with this insight, you gain a distinct advantage, positioning yourself uniquely from others.",
  //     Icon: Icons.TargetIcon,
  // },
  {
    title: "Front-End Development",
    description: "",
    Icon: Icons.WebDesignIcon,
  },
  {
    title: "Back-End Development",
    description: "",
    Icon: Icons.ServerIcon,
  },
  {
    title: "Responsive Design",
    description: "",
    Icon: Icons.DesktopMobileIcon,
  },
];

export const specialties = [
  {
    title: "Web Hosting and Deployment",
    Icon: Icons.DatabaseIcon,
  },
  // {
  //     title: 'API Development and Integration',
  //     Icon: Icons.APIIcon,
  // },
  // {
  //     title: 'Custom Web Applications',
  //     Icon: Icons.ProgrammingIcon,
  // },
  {
    title: "Portfolio Websites",
    Icon: Icons.PortfolioIcon,
  },
  // {
  //     title: 'CMS Development and Customization',
  //     Icon: Icons.WebContentIcon,
  // },
  // {
  //     title: 'Web Performance Optimization',
  //     Icon: Icons.RocketIcon,
  // },
  // {
  //     title: 'Website Maintenance',
  //     Icon: Icons.ToolsIcon,
  // },
  // {
  //     title: 'Website Migration',
  //     Icon: Icons.LeftRightArrowsIcon,
  // },
];
