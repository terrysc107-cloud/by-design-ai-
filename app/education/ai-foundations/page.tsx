import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  FOUNDATIONS_DISCLAIMER,
  FOUNDATIONS_NAME,
  FOUNDATIONS_ON_SALE,
  FOUNDATIONS_PRICE,
} from '@/lib/education'
import EnrollAction from './EnrollAction'
import './foundations.css'

const DESCRIPTION =
  'A self-paced beginner course from AI by Design. No coding, no technical background. Learn to use AI for real tasks at work and in everyday life, in 12 narrated chapters. Works in ChatGPT, Claude, or Gemini.'

export const metadata: Metadata = {
  title: 'AI Foundations, Self-Paced Course | AI by Design',
  description: DESCRIPTION,
  alternates: { canonical: '/education/ai-foundations' },
  openGraph: {
    type: 'website',
    url: 'https://aixdesign.dev/education/ai-foundations',
    title: 'AI Foundations | AI by Design',
    description: DESCRIPTION,
    images: ['/foundations/poster.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Foundations | AI by Design',
    description: DESCRIPTION,
    images: ['/foundations/poster.webp'],
  },
}

const PROBLEMS = [
  {
    title: 'You tried it and stalled',
    body: 'Maybe you have opened ChatGPT a few times but do not know what else to ask it.',
  },
  {
    title: 'Others seem to have it figured out',
    body: 'You see people making useful things with AI and wonder how they are doing it.',
  },
  {
    title: 'You worry you are falling behind',
    body: 'Maybe you feel you are missing opportunities because you do not know where to begin.',
  },
]

const FIRST_WIN = [
  ['Organize your week', 'Dump everything on your mind. Get back the three things that matter most, a first step for each, and a plan that fits your free time.'],
  ['Write the email you keep putting off', 'Get a ready-to-edit draft and a list of what to check before you send it.'],
  ['Make sense of a confusing document', 'Get a plain-language summary, what you need to do, and the questions to ask.'],
] as const

const IMAGINE = [
  ['Get your work organized', 'Turn a messy task list into a clear action plan.'],
  ['Communicate more clearly', 'Draft emails, checklists, and updates that say what you mean.'],
  ['Bring your ideas to life', 'Turn rough notes into a plan, a draft, or a clear brief.'],
  ['Learn faster', 'Ask better questions, simplify complicated topics, and check what you are told.'],
  ['Get more from your day', 'Find where AI can take over repetitive work and support better decisions.'],
] as const

/** The six stages map onto the 12 chapters below. */
const JOURNEY = [
  ['01', 'Understand AI', 'What AI is, how it works, where it helps, and where it gets things wrong.', 'Ch 1'],
  ['02', 'Choose your tool', 'Pick a tool for what you are trying to do, not for what is trending.', 'Ch 2'],
  ['03', 'Communicate with AI', 'Clear instructions, the right context, and settings that remember how you work.', 'Ch 3 to 5'],
  ['04', 'Apply AI to your life', 'Check its work, research with real sources, and make sense of documents and numbers.', 'Ch 6 to 8'],
  ['05', 'Create with AI', 'Turn one set of facts into an email, a checklist, and a post that all agree.', 'Ch 9'],
  ['06', 'Build your own assistant', 'Package what you learned into an assistant and routine, then put it to work.', 'Ch 10 to 12'],
] as const

/** Titles match the lessons students see. One line each from COURSE.md. */
const CHAPTERS = [
  ['00', 'Start Here', 'Your first AI win in 15 minutes, plus your Build Journal and the fictional-data rule.', 'Your first AI win'],
  ['01', 'What AI Actually Is', 'How language models work, what they know, and why they get things wrong.', 'Your AI task list'],
  ['02', 'Choosing Your Tool', 'ChatGPT, Claude, and Gemini side by side, compared fairly, with privacy first.', 'Same task, three tools'],
  ['03', 'Prompting Fundamentals', 'Goal, context, audience, format, and a finish line. Change one thing at a time.', 'Prompt v1 to v3'],
  ['04', 'Context and Files', 'Facts versus preferences, reference examples, Projects, and what never goes in.', 'Your knowledge pack'],
  ['05', 'Custom Instructions and Memory', 'Instructions that apply to every chat, a voice guide, and when memory hurts.', 'Instructions and voice guide'],
  ['06', 'Checking the Work', 'Trace each claim, critical versus cosmetic errors, and when to reject a draft.', 'A check routine on 3 drafts'],
  ['07', 'Research with Evidence', 'A bounded question, real sources, dates that matter, evidence versus inference.', 'A source log and decision brief'],
  ['08', 'Documents and Simple Data', 'Tables and CSVs, blank versus zero, duplicates, and totals you check yourself.', 'A cleaned table, checked'],
  ['09', 'One Source, Many Deliverables', 'One approved fact sheet into an email, a checklist, and a post that all agree.', 'Two formats, one set of facts'],
  ['10', 'Build Your Assistant and Routine', 'Instructions plus knowledge plus starter prompts, run inside a written routine.', 'Assistant v1, tested on 3 cases'],
  ['11', 'From Assistants to Agents', 'Workflow or agent, a role charter, and permissions for what it may never do.', 'A role charter and permission table'],
  ['12', 'Capstone: Put It to Work', 'Use it on real work, measure honestly, and try it on a case you have not seen.', 'Your before and after write-up'],
] as const

const GALLERY = [
  ['live-run', 'Chapter 2: a live ChatGPT run, the same request sent again in a new chat.'],
  ['evidence', 'Chapter 7: sorting a claim into evidence, inference, and not confirmed.'],
  ['one-brief', 'Chapter 9: one source brief becomes an email and a checklist that agree.'],
  ['role-charter', 'Chapter 11: a written role charter for the worked-example assistant.'],
] as const

const INSIDE = [
  ['12', 'narrated video lectures, about 85 minutes in all, with slides and audio-only versions'],
  ['12', 'weekly projects, each building on the last, with a worked example to check yours against'],
  ['12', 'practice quizzes that show you the answers and why'],
  ['1', 'Build Journal, a practice-coach prompt, and a dated tool and access guide'],
] as const

const AUDIENCES = [
  ['For professionals', 'Build practical skills that help you work more efficiently and keep up as expectations change.'],
  ['For entrepreneurs', 'Explore business ideas, content, and marketing, and find the busywork AI can take off your plate.'],
  ['For everyday life', 'Plan, organize, learn, create, and solve problems with more confidence.'],
] as const

const NOT_FOR_YOU = [
  'You want AI to run your business for you. The checking and the decisions stay yours.',
  'You want a promised result. This teaches a skill, and what you do with it is up to you.',
  'You want to build software or agents in a terminal. That is a separate course.',
]

const FAQ = [
  ['What if I have never used AI before?', 'Perfect. Your first 15 minutes is a guided win with a ready-made prompt, and Chapter 1 starts from what AI is in plain words. If you can write an email, you can do every project.'],
  ['Do I need to know how to code?', 'No. No programming background is needed, and you will never open a terminal.'],
  ['I have already used ChatGPT. Is this for me?', 'Yes, if you have experimented but struggle to use it consistently or get results you trust. The course gives you a structured approach you can reuse on any task.'],
  ['Do I need to be good with technology?', 'You should be comfortable browsing the web. No advanced technical knowledge is needed.'],
  ['Which AI tool do I need?', 'Any one of ChatGPT, Claude, or Gemini. Free plans work for nearly every project. The lessons show ChatGPT, and the steps are the same in the other two. The tool and access guide lists what each free plan includes, with the date it was checked.'],
  ['How long does it take?', 'The lectures run about 7 minutes each. Most people spend an hour or so a week on the project. It is self-paced, so you can go faster or slower.'],
  ['Will this teach me how to make money with AI?', 'You will work through practical business and professional uses. The course does not promise income or employment outcomes.'],
  ['What about private or client information?', 'The course uses made-up names and sample data throughout, and teaches you what should never go into an AI tool. You never need to upload real client or patient details.'],
  ['Do I get feedback on my work?', 'Every project has a self-check rubric and a worked example to compare against. Personal review of your work is part of our coaching, not this course.'],
  ['What is the refund policy?', 'Email hello@aixdesign.dev within 24 hours of purchase and we will refund you in full. After 24 hours, purchases are final.'],
  ['What do I get when I finish?', 'A working assistant and routine for a task you really do, your Build Journal, and a certificate of completion.'],
] as const

export default function AIFoundationsPage() {
  return (
    <main className="fdn relative min-h-screen overflow-x-hidden">
      <Header />

      {/* Hero */}
      <section className="fdn-hero">
        <div className="fdn-wrap fdn-hero__grid">
          <div>
            <nav aria-label="Breadcrumb">
              <Link href="/education" className="fdn-crumb">
                Education
              </Link>
            </nav>
            <p className="fdn-eyebrow">{FOUNDATIONS_NAME} · Beginner course · AI for real life</p>
            <h1>Stop watching AI change the world. Start using it to change yours.</h1>
            <p className="fdn-lede">
              No coding. No technical background. No more wondering where to start. Learn to use AI to
              get organized, solve everyday problems, and bring your ideas to life.
            </p>
            <div className="fdn-actions">
              <EnrollAction placement="foundations-hero" compact />
              <a href="#curriculum" className="fdn-link">
                See the 12 chapters
              </a>
            </div>
            <p className="fdn-meta">Your first AI win in 15 minutes · Beginner friendly · Real-world projects · Free AI plans work</p>
          </div>
          <figure className="fdn-player">
            <video
              controls
              preload="none"
              playsInline
              poster="/foundations/poster.webp"
              width={1280}
              height={720}
            >
              <source src="/foundations/ch01-preview.mp4" type="video/mp4" />
            </video>
            <figcaption>Preview: the first minute of Chapter 1</figcaption>
          </figure>
        </div>
      </section>

      {/* Problem */}
      <section className="fdn-section">
        <div className="fdn-wrap">
          <h2>You have heard about AI. But are you actually using it?</h2>
          <div className="fdn-cards fdn-cards--3">
            {PROBLEMS.map(p => (
              <div key={p.title} className="fdn-card">
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
          <p className="fdn-sub">
            You do not need to become a technology expert. You need someone to show you how to make AI
            work for you. That is what {FOUNDATIONS_NAME} is for.
          </p>
        </div>
      </section>

      {/* Imagine */}
      <section className="fdn-section">
        <div className="fdn-wrap">
          <p className="fdn-eyebrow">What you will be able to do</p>
          <h2>Imagine what you could do with AI.</h2>
          <ol className="fdn-outcomes">
            {IMAGINE.map(([title, body], i) => (
              <li key={title}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
          <p className="fdn-sub">And most importantly, you learn how to do these things yourself.</p>
        </div>
      </section>

      {/* First win */}
      <section className="fdn-section">
        <div className="fdn-wrap">
          <p className="fdn-eyebrow">Start Here · Your first AI win</p>
          <h2>Your first AI win happens in 15 minutes, before your first lesson.</h2>
          <p className="fdn-sub">
            You should not have to watch hours of video before AI becomes useful. Take something you have
            been putting off, paste a ready-made prompt, and watch AI move it forward. Then make it better
            with one follow-up.
          </p>
          <div className="fdn-firstwin">
            <ul className="fdn-choices">
              {FIRST_WIN.map(([title, body], i) => (
                <li key={title}>
                  <h3>
                    {title}
                    {i === 0 && <span className="fdn-pill">Most people start here</span>}
                  </h3>
                  <p>{body}</p>
                </li>
              ))}
            </ul>
            <figure className="fdn-firstwin__shot">
              <Image
                src="/foundations/first-win.webp"
                alt="ChatGPT turns a messy brain dump into categories and the top 3 priorities for the week"
                width={740}
                height={542}
                sizes="(max-width: 900px) 100vw, 50vw"
              />
              <figcaption>
                Sam&apos;s first win: a real ChatGPT run of the &ldquo;organize your week&rdquo; prompt, with
                made-up data.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="fdn-section fdn-dark">
        <div className="fdn-wrap">
          <p className="fdn-eyebrow">How it works</p>
          <h2>From AI curious to AI capable.</h2>
          <p className="fdn-sub">
            You pick one real task in Chapter 1 and carry it all the way through. Every project builds on
            the one before, so you finish with more than information: you finish with a working assistant
            for something you really do.
          </p>
          <ol className="fdn-thread fdn-thread--6">
            {JOURNEY.map(([n, title, body, chapters]) => (
              <li key={n}>
                <span>
                  {n} · {chapters}
                </span>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Curriculum */}
      <section id="curriculum" className="fdn-section">
        <div className="fdn-wrap fdn-narrow">
          <p className="fdn-eyebrow">Curriculum</p>
          <h2>Start Here plus 12 chapters.</h2>
          <div className="fdn-chapters">
            {CHAPTERS.map(([n, title, teaches, project]) => (
              <details key={n}>
                <summary>
                  <span className="fdn-chapters__n">{n}</span>
                  <span className="fdn-chapters__t">{title}</span>
                </summary>
                <p>{teaches}</p>
                <p className="fdn-chapters__p">
                  <strong>Project:</strong> {project}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Audiences + fit */}
      <section className="fdn-section">
        <div className="fdn-wrap">
          <p className="fdn-eyebrow">Who it is for</p>
          <h2>Your goals. Your projects. Your AI journey.</h2>
          <div className="fdn-cards fdn-cards--3">
            {AUDIENCES.map(([title, body]) => (
              <div key={title} className="fdn-card">
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
          <div className="fdn-fit fdn-fit__no fdn-fit--single">
            <div>
              <h2>Skip it if</h2>
              <ul>
                {NOT_FOR_YOU.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Inside look */}
      <section className="fdn-section">
        <div className="fdn-wrap">
          <p className="fdn-eyebrow">Inside the course</p>
          <h2>This is not another course you just watch.</h2>
          <p className="fdn-sub">
            It is built around learning by doing: guided lessons, practical exercises, knowledge checks,
            and projects tied to real situations. You do not have to get everything right the first time.
            You just have to start.
          </p>
          <div className="fdn-gallery">
            {GALLERY.map(([file, caption]) => (
              <figure key={file}>
                <Image
                  src={`/foundations/${file}.webp`}
                  alt={caption}
                  width={1600}
                  height={900}
                  sizes="(max-width: 700px) 100vw, 50vw"
                />
                <figcaption>{caption}</figcaption>
              </figure>
            ))}
          </div>
          <ul className="fdn-inside">
            {INSIDE.map(([n, text]) => (
              <li key={text}>
                <strong>{n}</strong>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Instructor */}
      <section className="fdn-section">
        <div className="fdn-wrap fdn-narrow">
          <div className="fdn-card fdn-instructor">
            <p className="fdn-eyebrow">Meet your instructor</p>
            <h2>Terry Scott</h2>
            <p className="fdn-instructor__role">Founder, educator, and systems builder</p>
            <p>
              Terry has spent a career building businesses, developing educational programs, and helping
              people turn complicated processes into systems they can understand and use. This course
              follows the same principle: make it practical, make it understandable, make it useful.
            </p>
            <p>
              {FOUNDATIONS_NAME} was made to help everyday people build the confidence to use AI, not just
              hear about it.
            </p>
            <Link href="/about" className="fdn-link">
              More about Terry
            </Link>
          </div>
        </div>
      </section>

      {/* Enroll */}
      <section id="enroll" className="fdn-section">
        <div className="fdn-wrap fdn-narrow">
          <div className="fdn-price">
            <p className="fdn-eyebrow">{FOUNDATIONS_ON_SALE ? 'Enroll' : 'Opening soon'}</p>
            <h2>Your next skill starts here.</h2>
            <p className="fdn-sub">
              You do not need to know everything about AI. You need to know how to start using it.
            </p>
            <h3 className="fdn-price__name">{FOUNDATIONS_NAME}</h3>
            {FOUNDATIONS_ON_SALE && (
              <p className="fdn-price__amount">
                {FOUNDATIONS_PRICE} <span>one-time</span>
              </p>
            )}
            <ul>
              <li>12 narrated lectures with slides and audio-only versions</li>
              <li>12 weekly projects with worked examples and self-check rubrics</li>
              <li>12 practice quizzes</li>
              <li>Build Journal, practice-coach prompt, and tool and access guide</li>
              <li>Self-paced, with a certificate of completion</li>
            </ul>
            <EnrollAction placement="foundations-pricing" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="fdn-section">
        <div className="fdn-wrap fdn-narrow">
          <h2>Questions</h2>
          <div className="fdn-faq">
            {FAQ.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="fdn-section fdn-dark fdn-final">
        <div className="fdn-wrap fdn-narrow">
          <h2>You do not have to master AI today. You just have to take the first step.</h2>
          <p className="fdn-sub">Build confidence. Learn practical skills. Make something useful.</p>
          <div className="fdn-actions">
            <EnrollAction placement="foundations-final" compact />
          </div>
          <p className="fdn-tagline">Learn it. Apply it. Build with it.</p>
          <p className="fdn-disclaimer">{FOUNDATIONS_DISCLAIMER}</p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
