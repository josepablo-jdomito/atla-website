import type { FaqGroup } from '@/types'

export const submitFaqGroups: FaqGroup[] = [
  {
    title: 'Submissions',
    items: [
      { question: 'Is submitting free?', answer: 'Yes. Editorial submissions are free.' },
      { question: 'Do you guarantee publication?', answer: 'No. We curate what matches our standards, audience, and calendar.' },
      { question: 'How long does review take?', answer: 'We review weekly. If selected, you typically hear from us within 7 to 14 days.' },
      { question: 'What if my project is older or already posted online?', answer: "That's fine. We care about quality and relevance, not newness." },
      { question: 'Can I submit concept work or student work?', answer: "Yes, if it's exceptional. Please label it clearly as concept or student." },
      { question: 'Can I edit my submission after sending it?', answer: 'Yes. Send an updated folder link and include the project name with "Updated" in the message.' },
      { question: 'What is the minimum number of images?', answer: '8 is ideal. If you have fewer, submit what you have and include a folder link for more.' },
      { question: 'What kinds of work do you publish?', answer: 'Branding, packaging, web, typography, editorial, art direction, and design-led spaces.' },
    ],
  },
  {
    title: 'Credits and Rights',
    items: [
      { question: 'Will you credit the full team?', answer: 'Yes. We credit every collaborator you provide (design, strategy, photo, motion, copy, dev).' },
      { question: 'Do I keep ownership of my work?', answer: 'Yes. You keep full ownership. By submitting, you grant us permission to publish your assets across our platforms to promote the feature.' },
      { question: 'Can I submit work under NDA?', answer: 'Only if the client has approved public release.' },
    ],
  },
  {
    title: 'Publishing',
    items: [
      { question: 'Can I request a specific publish date?', answer: "You can request it. We can't guarantee it, but we'll do our best when scheduling allows." },
      { question: 'Do you edit the copy?', answer: 'Yes. We may edit for clarity and format while preserving your meaning and credits.' },
    ],
  },
  {
    title: 'Contact',
    items: [
      { question: 'Who do I contact about a submission?', answer: 'Email hello@welovedaily.com and include the project name in the subject.' },
    ],
  },
]
