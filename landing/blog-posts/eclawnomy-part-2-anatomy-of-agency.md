# Eclawnomy Part 2: The Anatomy of Agency (What’s Inside a Claw?)

> To the ordinary person, an AI agent looks like magic. But magic is just technology with a high knowledge barrier. Today, we’re tearing down that barrier. Let’s dissect the "Claw" and see how the **Eclawnomy** actually functions at the unit level.

---

## Beyond the Prompt

If GPT-5.4 is the "Brain," then a Claw is the "Body." To move from a chatbot to an autonomous coworker, an agent needs more than just reasoning. They need a 6-layer stack.

### 1. The Foundation: Infrastructure

Before a Claw can think, it needs a place to live. This is the underlying cloud environment (like the serverless AWS/SST stack we use for **ServerlessClaw**) that provides the compute and networking required for autonomous action.

### 2. The Energy: Tokens & LLMs

In the **Eclawnomy** (a term I created to describe this new era), **Tokens are the fuel.** Every thought has a price. We use a hierarchy of models: high-reasoning (o1/Claude) for planning, and lightning-fast "mini" models for routine checks. This ensures the unit cost of intelligence stays low.

### 3. The Repertoire: Skills

A Claw isn't born knowing how to refactor a Next.js app. It has **Skills**—pre-defined templates and logic blocks that it can "load" into its context. Think of Skills as the "training" your coworker receives.

### 4. The Ports: MCP (Model Context Protocol)

How does an agent talk to your database, your GitHub, or your Stripe? We use **MCP**. It’s the universal port of the agentic era. By standardizing how models interact with tools, we remove the friction of custom integrations.

### 5. The Short & Long Term: Memory

A chatbot forgets who you are the moment you close the tab. A Claw has **Cognitive Tiering**:

- **Active Session**: What it’s doing _right now_.
- **Local Context**: Relevant files and dependencies.
- **Episodic Memory**: Lessons learned from previous (failed or successful) mutations.

### 6. The Director: Agentic Team Building (Orchestration)

This is the glue. It's the logic that says: "The Planner has a goal -> The Coder needs these tools -> The QA Auditor must verify the result." Orchestration is the difference between a random script and a reliable coworker. Just as team building was critical in the past, **Agentic Team Building** is the core skill of the current era.

## Why You Should Care

Understanding this stack is the first step to overcoming the **Knowledge Barrier.** You don't need to write the code for these layers—Frameworks like **OpenClaw** and **ServerlessClaw** do that for you—but knowing how they work allows you to manage your agentic team with confidence.

In our next post, we’ll talk about the "Physics" of the Eclawnomy: How to host this entire stack with **$0 Idle Cost.**

---

**Deep Dive:**

- See our [Agentic Skills](https://github.com/getaiready/aiready-skills) repository.
- Learn more about the [Model Context Protocol](https://modelcontextprotocol.io).

_Peng Cao is the creator of the **Eclawnomy** and founder of AIReady._
