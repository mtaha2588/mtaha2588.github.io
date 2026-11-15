var e=`---
title: How I scope an AI automation project
date: 2026-11-15
description: The questions I ask before building an AI automation, and why a fixed written scope protects both sides.
draft: false
---

Most small businesses don't need "an AI". They need one slow, repetitive task to stop eating hours every week. Before writing any code, I try to pin that task down precisely.

## 1. What exactly is repeated?

I ask for a real example: an email, a spreadsheet, a form submission, and what a person does with it today, step by step. If the steps can't be written down, they can't be automated reliably yet.

## 2. Where does the data live?

Automation is mostly plumbing. I list every tool the workflow touches (inbox, CRM, sheets, a database) and check that each one has an API or export I can use.

## 3. Where should a human stay in the loop?

Anything that sends money, messages customers or changes records gets a review step until you trust it. Every action is logged so you can see what happened and why.

## 4. What does "done" look like?

We agree on a small, testable outcome, for example "new inquiries are sorted and drafted replies are waiting for approval". That outcome goes into a written scope with a fixed price and timeline.

## 5. Build in small, visible steps

You get a weekly update with something you can try. Feedback goes in early, when changes are cheap.

---

If you have a task like this in mind, [tell me about it](/#contact). The first call is free.
`;function t(e){let t=e.replace(RegExp(`^﻿`),``),n=t.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);if(!n)return{data:{},body:t};let r={};for(let e of n[1].split(/\r?\n/)){let t=e.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);if(!t)continue;let n=t[2].trim().replace(/^["']|["']$/g,``);n===`true`?n=!0:n===`false`&&(n=!1),r[t[1]]=n}return{data:r,body:n[2]}}function n(e){return e.replace(/^.*[\\/]/,``).replace(/\.md$/,``).replace(/^\d{4}-\d{2}-\d{2}-/,``)}var r=Object.entries(Object.assign({"../content/notes/2026-11-15-how-i-scope-an-ai-automation-project.md":e})).map(([e,r])=>{let{data:i,body:a}=t(r);return{slug:n(e),body:a,...i}}).filter(e=>e.title&&!e.draft).sort((e,t)=>String(t.date).localeCompare(String(e.date))),i=e=>r.find(t=>t.slug===e)??null,a=e=>{let t=new Date(`${e}T00:00:00`);return Number.isNaN(t.getTime())?``:t.toLocaleDateString(`en-US`,{year:`numeric`,month:`long`,day:`numeric`})};export{i as n,a as r,r as t};