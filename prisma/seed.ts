import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Clean database
  await prisma.comment.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});

  // Hash passwords
  const passwordHash = await bcrypt.hash("password123", 10);

  // Seed Users
  const instructor = await prisma.user.create({
    data: {
      name: "Alex DevInstructor",
      email: "instructor@codemaster.com",
      password: passwordHash,
      role: "INSTRUCTOR",
      bio: "Full Stack Engineer, educator, and systems developer. Passionate about teaching modern architectures.",
    },
  });

  const student = await prisma.user.create({
    data: {
      name: "John Student",
      email: "student@codemaster.com",
      password: passwordHash,
      role: "STUDENT",
      bio: "Aspiring software developer looking to master Next.js and System Design.",
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "CodeMaster Admin",
      email: "admin@codemaster.com",
      password: passwordHash,
      role: "ADMIN",
      bio: "Platform Administrator.",
    },
  });

  console.log("Users seeded successfully.");

  // Seed Courses
  const course1 = await prisma.course.create({
    data: {
      title: "Complete Next.js 15 Bootcamp",
      slug: "complete-nextjs-15-bootcamp",
      description: "Master Next.js 15, React Server Components, Server Actions, and database integration using Prisma and SQLite from scratch.",
      price: 49.99,
      level: "INTERMEDIATE",
      category: "Web Development",
      thumbnail: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=800&q=80",
      instructorId: instructor.id,
      published: true,
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: "Advanced Data Structures in Python",
      slug: "advanced-data-structures-in-python",
      description: "Dive deep into custom implementations of Trees, Graphs, Hash Maps, and performance optimization techniques with Big O notation analysis.",
      price: 39.99,
      level: "ADVANCED",
      category: "Computer Science",
      thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
      instructorId: instructor.id,
      published: true,
    },
  });

  const course3 = await prisma.course.create({
    data: {
      title: "System Design Interview Prep",
      slug: "system-design-interview-prep",
      description: "Learn how to architect large-scale systems. Covers load balancing, horizontal vs vertical scaling, API gateways, database sharding, and caching.",
      price: 59.99,
      level: "ADVANCED",
      category: "Software Engineering",
      thumbnail: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80",
      instructorId: instructor.id,
      published: true,
    },
  });

  const course4 = await prisma.course.create({
    data: {
      title: "Web3 DApp Development with Solidity",
      slug: "web3-dapp-development-with-solidity",
      description: "Enter the world of decentralized systems. Write smart contracts, deploy tokens, and build beautiful React frontends connected to Ethereum.",
      price: 69.99,
      level: "BEGINNER",
      category: "Blockchain",
      thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80",
      instructorId: instructor.id,
      published: true,
    },
  });

  console.log("Courses seeded successfully.");

  // Seed Lessons
  // Course 1 Lessons
  await prisma.lesson.createMany({
    data: [
      {
        courseId: course1.id,
        title: "Introduction to React Server Components",
        content: `### What are React Server Components (RSC)?

React Server Components represent a paradigm shift in how we build React applications. They run exclusively on the server, resulting in zero-bundle-size impact for their dependencies.

#### Key Benefits:
1. **Zero Bundle Size**: Large dependencies (like markdown parsers or date utilities) used only inside server components are never sent to the client.
2. **Direct Backend Access**: Access databases, caches, and files directly without API routes.
3. **Improved SEO**: Server-rendered HTML is immediately indexable by search engine bots.

Here is a basic server component example fetching data:

\`\`\`tsx
import { db } from "@/lib/db";

export default async function UserList() {
  const users = await db.user.findMany();
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
\`\`\`
`,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        order: 1,
        isFreePreview: true,
      },
      {
        courseId: course1.id,
        title: "Routing & Layouts in App Router",
        content: `### Nested Routing & Shared Layouts

The Next.js App Router uses a file-system based router where folders define routes. 
A special file named \`page.tsx\` is used to make a route path accessible.

- \`app/page.tsx\` maps to \`/\`
- \`app/dashboard/page.tsx\` maps to \`/dashboard\`
- \`app/dashboard/layout.tsx\` defines a layout shared by all nested subroutes.

#### Creating a Shared Layout:
Layout components accept a \`children\` prop and preserve state during route transitions.

\`\`\`tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">Sidebar Links</aside>
      <main className="content">{children}</main>
    </div>
  );
}
\`\`\`
`,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        order: 2,
        isFreePreview: false,
      },
      {
        courseId: course1.id,
        title: "Data Fetching & Server Actions",
        content: `### Server Actions in Next.js 15

Server Actions are asynchronous functions that execute on the server. They can be invoked in both Server and Client Components to handle form submissions, database mutations, and state changes.

#### Defining a Server Action:
Add the \`"use server"\` directive at the top of the function or file:

\`\`\`typescript
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createComment(postId: string, text: string) {
  await db.comment.create({
    data: {
      blogPostId: postId,
      content: text,
      userId: "some-user-id"
    }
  });

  revalidatePath(\`/blog/\${postId}\`);
}
\`\`\`
`,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        order: 3,
        isFreePreview: false,
      },
    ],
  });

  // Course 2 Lessons
  await prisma.lesson.createMany({
    data: [
      {
        courseId: course2.id,
        title: "Time and Space Complexity Analysis",
        content: `### Introduction to Big O Notation

Big O notation describes the execution time or space requirements of an algorithm in the worst-case scenario as input size $N$ grows.

#### Common Time Complexities:
- **$O(1)$**: Constant Time (Array lookup by index)
- **$O(\\log N)$**: Logarithmic Time (Binary Search in a sorted list)
- **$O(N)$**: Linear Time (Iterating through an array)
- **$O(N \\log N)$**: Linearithmic Time (Merge Sort, Quick Sort)
- **$O(N^2)$**: Quadratic Time (Nested loops - Bubble Sort)

#### Python Complexity Code Example:
\`\`\`python
# O(N) Time Complexity Example
def find_target(arr, target):
    for index, element in enumerate(arr):
        if element == target:
            return index
    return -1
\`\`\`
`,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        order: 1,
        isFreePreview: true,
      },
      {
        courseId: course2.id,
        title: "Implementing Self-Balancing Trees",
        content: `### Binary Search Trees and Balancing

A Binary Search Tree (BST) provides $O(\\log N)$ operations for search, insertion, and deletion if it is balanced. However, in the worst case (e.g. inserting elements in sorted order), it degrades to $O(N)$ (a linked list).

#### AVL Trees and Red-Black Trees:
Self-balancing trees automatically perform rotations during insertions and deletions to keep their height minimal.

- **AVL Tree**: Stricter balance. Balance factor difference cannot exceed 1. Fast lookups, slower updates.
- **Red-Black Tree**: Relaxed balance. Leaves are black, children of red nodes must be black. Fast insertions/deletions.
`,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        order: 2,
        isFreePreview: false,
      },
      {
        courseId: course2.id,
        title: "Graph Algorithms: Dijkstra and A*",
        content: `### Shortest Path Algorithms in Graphs

Graphs model networks of nodes (vertices) connected by edges. Finding the shortest path is a common requirement in maps, networking, and game AI.

#### Dijkstra's Algorithm:
Finds the shortest path from a single source node to all other nodes in a weighted graph with non-negative edge weights. It uses a Min-Priority Queue.

#### A* Search Algorithm:
An extension of Dijkstra's algorithm that uses heuristics (like Euclidean or Manhattan distance) to prioritize exploring nodes closer to the destination, speeding up search significantly.
`,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        order: 3,
        isFreePreview: false,
      },
    ],
  });

  // Course 3 Lessons
  await prisma.lesson.createMany({
    data: [
      {
        courseId: course3.id,
        title: "Scalability, Availability, and Latency",
        content: `### High-Level System Architecture Design Principles

When designing web applications serving millions of users, we must understand core tradeoffs:

1. **Scalability**: The ability of a system to handle increased load by adding resources.
   - *Horizontal Scaling*: Adding more machines (nodes).
   - *Vertical Scaling*: Adding more CPU/RAM to a single machine.
2. **Availability**: The percentage of time a system remains operational (e.g. "three nines" 99.9% vs "five nines" 99.999%).
3. **Latency**: The time it takes for a request to be completed (measured in milliseconds).
`,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        order: 1,
        isFreePreview: true,
      },
      {
        courseId: course3.id,
        title: "Load Balancers and API Gateways",
        content: `### Managing Traffic Distribution

A **Load Balancer (LB)** sits between the client and backend servers, distributing incoming network traffic across multiple servers to prevent overload and ensure high availability.

#### Load Balancing Algorithms:
- Round Robin
- Least Connections
- IP Hash

A **API Gateway** acts as a single entry point for microservices, handling routing, rate limiting, authentication, logging, and request/response transformations.
`,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        order: 2,
        isFreePreview: false,
      },
      {
        courseId: course3.id,
        title: "Designing a Distributed Cache (like Redis)",
        content: `### Caching at Scale

Caching stores frequently accessed data in memory to reduce latency and database load.

#### Eviction Policies:
- **LRU (Least Recently Used)**: Discards the least recently accessed items first.
- **LFU (Least Frequently Used)**: Discards items with the lowest access count.
- **FIFO (First In First Out)**: Simple queue-based eviction.

#### Cache Invalidation Strategies:
1. **Cache-aside**: Application queries cache. If miss, queries DB, updates cache, and returns.
2. **Write-through**: Data is written to cache and database synchronously.
3. **Write-behind (Write-back)**: Data is written to cache immediately, database is updated asynchronously.
`,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        order: 3,
        isFreePreview: false,
      },
    ],
  });

  // Course 4 Lessons
  await prisma.lesson.createMany({
    data: [
      {
        courseId: course4.id,
        title: "Introduction to Blockchain & Ethereum",
        content: `### Blockchain Basics

A blockchain is a decentralized, distributed, and immutable digital ledger.

#### Core Concepts:
- **Block**: Contains a list of transactions, a timestamp, and the cryptographic hash of the previous block.
- **Consensus Mechanism**: Protocol (Proof of Work, Proof of Stake) ensuring all nodes agree on the ledger state.
- **Smart Contract**: Self-executing programs running on-chain when specific parameters are met.
- **EVM (Ethereum Virtual Machine)**: The global runtime environment executing smart contract bytecode.
`,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        order: 1,
        isFreePreview: true,
      },
      {
        courseId: course4.id,
        title: "Writing Your First Smart Contract",
        content: `### Introduction to Solidity

Solidity is a contract-oriented, high-level programming language for implementing smart contracts on Ethereum.

Here is a basic Solidity contract to store and retrieve a value:

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    uint256 private data;

    event DataChanged(uint256 newValue);

    function set(uint256 x) public {
        data = x;
        emit DataChanged(x);
    }

    function get() public view returns (uint256) {
        return data;
    }
}
\`\`\`
`,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        order: 2,
        isFreePreview: false,
      },
      {
        courseId: course4.id,
        title: "Connecting Metamask with Ethers.js",
        content: `### Frontend Web3 DApp Integration

To interact with a deployed smart contract, our client-side React code needs a provider (like Metamask) to sign transactions.

#### Quick Ethers.js integration code:
\`\`\`javascript
import { ethers } from "ethers";

async function connectWallet() {
  if (window.ethereum) {
    // Request account access
    await window.ethereum.request({ method: "eth_requestAccounts" });
    
    // Create connection provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    
    console.log("Connected Wallet Address:", address);
  } else {
    alert("Please install MetaMask!");
  }
}
\`\`\`
`,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        order: 3,
        isFreePreview: false,
      },
    ],
  });

  console.log("Lessons seeded successfully.");

  // Seed Blog Posts
  await prisma.blogPost.create({
    data: {
      title: "Understanding React Server Components",
      slug: "understanding-react-server-components",
      content: `## The Evolution of React Rendering

For years, React was purely a client-side library. Later, Server-Side Rendering (SSR) allowed hydration. Now, **React Server Components (RSC)** provide a hybrid model where components can render on the server, sending static structure and only streaming dynamic elements to the browser.

### Key Advantages of RSC:
- **Performance**: Loads static layout fast.
- **Resource Savings**: Reduces client-side bundle size.
- **Developer Experience**: Write backend database code straight inside a component.

\`\`\`tsx
// This runs on the server
import { db } from "@/lib/db";

export default async function BlogFeed() {
  const posts = await db.blogPost.findMany({ where: { published: true } });
  return (
    <div className="posts-feed">
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content.slice(0, 100)}...</p>
        </article>
      ))}
    </div>
  );
}
\`\`\`

Using server components makes your React apps faster, more modular, and incredibly easy to maintain.
`,
      authorId: instructor.id,
      category: "WebDev",
      tags: JSON.stringify(["nextjs", "react", "frontend"]),
      published: true,
    },
  });

  await prisma.blogPost.create({
    data: {
      title: "How to Deploy Prisma to Vercel",
      slug: "how-to-deploy-prisma-to-vercel",
      content: `## Deploying Database Migrations and Clients

Integrating Prisma in a Vercel serverless environment requires configuring your database connection string and matching transaction limits correctly.

### Step-by-Step Vercel Deployment Checklist:

1. **Connection String**: Set the \`DATABASE_URL\` env variable in Vercel project settings.
2. **Build Commands**: Append the prisma generate command to your build script:
   \`\`\`json
   "scripts": {
     "build": "prisma generate && next build"
   }
   \`\`\`
3. **Connection Pooling**: Use transaction-safe connection poolers like PgBouncer or serverless adapters (like Prisma Accelerate) when using relational databases to prevent connection exhaustion.

In our local SQLite setup, we use a single file database (\`file:./dev.db\`), which is simple and works perfectly for local prototyping!
`,
      authorId: instructor.id,
      category: "DevOps",
      tags: JSON.stringify(["prisma", "database", "vercel"]),
      published: true,
    },
  });

  await prisma.blogPost.create({
    data: {
      title: "10 Tips for Cleaner TypeScript Code",
      slug: "10-tips-for-cleaner-typescript-code",
      content: `## Write Safer, Self-Documenting Types

TypeScript is powerful, but writing poor typings defeats the compiler's purpose. Here are 3 quick tips to make your TS clean:

1. **Avoid \`any\`**: Use \`unknown\` if you don't know the type, and perform runtime checks.
2. **Use Discriminated Unions**:
   \`\`\`typescript
   interface SuccessResponse {
     status: "success";
     data: string[];
   }
   interface ErrorResponse {
     status: "error";
     message: string;
   }
   type ApiResponse = SuccessResponse | ErrorResponse;
   \`\`\`
3. **Prefer Utility Types**: Utilize \`Partial\`, \`Pick\`, \`Omit\`, and \`Record\` to prevent code duplication.
`,
      authorId: instructor.id,
      category: "Software Engineering",
      tags: JSON.stringify(["typescript", "programming"]),
      published: true,
    },
  });

  await prisma.blogPost.create({
    data: {
      title: "Introduction to Solidity and Smart Contracts",
      slug: "introduction-to-solidity-and-smart-contracts",
      content: `## Smart Contracts 101

A smart contract is code that executes directly on a decentralized ledger. Let's look at key safety practices in Solidity:

- **State variables**: Kept in persistent storage on-chain. Costly to modify.
- **Gas optimization**: Operations are paid in Ethereum gas. Choose minimal data sizes (\`uint8\` vs \`uint256\`) carefully.
- **Access control**: Restrict critical functions (like withdrawal) using modifiers like \`onlyOwner\`.

\`\`\`solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Not authorized");
    _;
}
\`\`\`
`,
      authorId: instructor.id,
      category: "Web3",
      tags: JSON.stringify(["solidity", "ethereum", "web3"]),
      published: true,
    },
  });

  await prisma.blogPost.create({
    data: {
      title: "Mastering CSS Grid and Flexbox Layouts",
      slug: "mastering-css-grid-and-flexbox-layouts",
      content: `## Grid vs Flexbox: When to use which?

CSS layout can be challenging. Here's a clean guide to choose the right layout style:

### CSS Grid
Designed for **two-dimensional** layouts (both rows and columns).
\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
\`\`\`

### CSS Flexbox
Designed for **one-dimensional** layouts (either a single row OR a single column). Excellent for headers, vertical sidebars, alignment, and centering.
\`\`\`css
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`
`,
      authorId: instructor.id,
      category: "CSS",
      tags: JSON.stringify(["css", "frontend", "design"]),
      published: true,
    },
  });

  console.log("Blog posts seeded successfully.");
  console.log("Seeding finished!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
