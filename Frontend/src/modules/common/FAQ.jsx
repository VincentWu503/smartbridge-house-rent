import { useState } from 'react';
import { Link } from 'react-router-dom';

const adminWhatsAppNumber = '6289999999999';

const ownerFaqs = [
  {
    question: "Why can't I publish my property yet?",
    answer:
      'New owner accounts must be approved by an admin before listings go live. This helps protect renters from fake listings and makes verified owners more trustworthy.',
  },
  {
    question: 'What documents do I need to submit?',
    answer:
      'Prepare a government ID and proof that you own the property or are authorized to rent it out, such as a certificate, tax record, or letter from the owner. The admin can confirm the documents needed for your case.',
  },
  {
    question: 'How do I submit my documents?',
    answer: (
      <>
        Send your documents to the official ComfyRent admin WhatsApp number{' '}
        <a
          href={`https://wa.me/${adminWhatsAppNumber}`}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-indigo-700 underline underline-offset-2 hover:text-indigo-900"
        >
          +62 899 9999 9999
        </a>
        . Use only the number shown here, and never send documents to anyone
        else claiming to be an admin.
      </>
    ),
  },
  {
    question: 'How long does approval take?',
    answer:
      'Review times can vary. Your account status will update in the system after the admin makes a decision, including when you sent your documents through WhatsApp.',
  },
  {
    question: 'What do the statuses mean?',
    answer:
      'Pending means the admin has not reviewed your request yet. Needs more information means something is missing or unclear. Approved means you can list properties and receive a verified badge where available. Rejected means the request was declined; check the reason provided.',
  },
  {
    question: 'My request was rejected. What now?',
    answer:
      'Review the reason, correct the issue (for example, provide a clearer photo or resolve a name mismatch in the ownership proof), and contact the admin using the official WhatsApp number if you need clarification.',
  },
  {
    question: 'Can I prepare my listing while I wait?',
    answer:
      'You can prepare your property details while waiting for verification. A listing should only be published after your owner account is approved.',
  },
  {
    question: 'Is it safe to send my documents over WhatsApp?',
    answer:
      'Documents should be used only for verification and shared only with authorized admins. If you are unsure whether a request is genuine, verify it using the official number displayed on this page before sending anything.',
  },
  {
    question:
      'I rent out a property that belongs to a family member or someone else. Can I still list it?',
    answer:
      'You can request verification if you have authorization from the owner, such as a signed letter or power of attorney. The admin may ask for proof before approving the listing.',
  },
  {
    question: 'Do I need to verify again for every property?',
    answer:
      'Owner verification is generally account-based. An admin may still ask for proof related to a specific property if details need clarification.',
  },
  {
    question: 'What does the verified badge mean, and can I lose it?',
    answer:
      'A verified badge indicates that an admin has reviewed your identity and your authorization to rent out properties. It may be removed if a report against you is confirmed.',
  },
];

const renterFaqs = [
  {
    question: 'How do I know an owner is genuine?',
    answer:
      'Look for the verified badge. Owners approved by an admin can publish listings. You should still confirm the property details directly before making arrangements.',
  },
  {
    question: 'Does “verified” guarantee nothing can go wrong?',
    answer:
      "No. Verification means the owner's identity and right to rent out the property were checked; it cannot guarantee every listing detail or the owner’s behavior. Visit the property, compare it with the listing, and keep records of your communication.",
  },
  {
    question: "What if a listing looks fake or the details don't match?",
    answer:
      'Use the Report owner link on the property card and include the reason and details. The admin can review reports and take appropriate action.',
  },
  {
    question:
      "The owner hasn't responded to my booking request. What should I do?",
    answer:
      'Check your booking status first. Owners are notified when you book, but replies may take time. If you do not hear back, you can consider another property or contact the admin using the official WhatsApp number on this page.',
  },
  {
    question: 'What do the booking statuses mean?',
    answer:
      'Pending means the owner has not confirmed the request yet. Booked means the owner has marked it as booked. For the next steps or a change of plans, contact the owner through the details provided for your booking.',
  },
  {
    question: 'Can I cancel a booking?',
    answer:
      'Contact the owner as soon as possible to discuss cancelling or changing your booking. If you need help, contact the admin using the official WhatsApp number on this page.',
  },
  {
    question:
      "What if an owner asks me to pay or send a deposit before I've seen the property and signing contract agreement?",
    answer:
      'Treat this as a warning sign. Do not transfer money before you have seen the property and confirmed the owner. Report the owner through the app.',
  },
  {
    question: 'Why do I need an account to see price and contact details?',
    answer:
      'Registration helps protect owner contact details and lets ComfyRent associate bookings with an account.',
  },
  {
    question: 'Will my phone number be shared with strangers?',
    answer:
      'Your phone number is provided to the owner when you book a property so they can contact you about that booking.',
  },
];

const FaqSection = ({ title, description, questions }) => {
  const [openQuestion, setOpenQuestion] = useState(null);

  return (
    <section className="mt-10 first:mt-0" aria-labelledby={`${title}-heading`}>
      <div className="mb-4">
        <h2
          id={`${title}-heading`}
          className="text-2xl font-bold text-slate-900"
        >
          {title}
        </h2>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>
      <div className="space-y-3">
        {questions.map(({ question, answer }, index) => {
          const isOpen = openQuestion === index;
          const panelId = `${title.toLowerCase().replaceAll(' ', '-')}-answer-${index}`;

          return (
            <div
              key={question}
              className={`rounded-xl border bg-white shadow-sm transition-colors ${
                isOpen ? 'border-indigo-200 shadow-md' : 'border-slate-200'
              }`}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenQuestion(isOpen ? null : index)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl px-5 py-4 text-left font-semibold text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <span>{question}</span>
                <span
                  aria-hidden="true"
                  className={`shrink-0 text-xl text-indigo-600 transition-transform duration-300 ease-in-out ${
                    isOpen ? 'rotate-90' : ''
                  }`}
                >
                  &gt;
                </span>
              </button>
              <div
                id={panelId}
                aria-hidden={!isOpen}
                inert={!isOpen}
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
                  isOpen
                    ? 'grid-rows-[1fr] opacity-100'
                    : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="border-t border-slate-100 px-5 py-4 text-sm leading-7 text-slate-600">
                    {answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const FAQ = () => {
  const [questionFor, setQuestionFor] = useState('All');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      <main className="mx-auto w-full max-w-7xl px-6 py-10 sm:py-14">
        <Link
          to="/"
          className="mb-5 inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-white px-4 py-2 
        font-semibold text-indigo-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 focus-visible:outline-2 
        focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <span aria-hidden="true">←</span>
          Back to home
        </Link>

        <header className="mb-8 rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-700">
            ComfyRent support
          </p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900 sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            Find answers about owner verification, property listings, bookings,
            and staying safe on ComfyRent.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl bg-green-50 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-900">
                Official admin WhatsApp
              </p>
              <p className="text-sm text-slate-600">
                Contact the admin using this number only.
              </p>
            </div>
            <a
              href={`https://wa.me/${adminWhatsAppNumber}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-green-700 px-4 py-2 font-semibold text-white transition hover:bg-green-800"
            >
              +62 899 9999 9999
            </a>
          </div>
        </header>

        <div className="mb-6 flex flex-col gap-4">
          <h2 className="mt-2 text-2xl font-bold text-white">
            Filter FAQs by Type
          </h2>
          <div className="flex flex-wrap gap-3" aria-label="FAQ type filter">
            {['All', 'Owner', 'Renter'].map((type) => (
              <button
                key={type}
                type="button"
                aria-pressed={questionFor === type}
                onClick={() => setQuestionFor(type)}
                className={`rounded-lg border px-6 py-2 font-semibold shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300 ${
                  questionFor === type
                    ? 'border-indigo-500 bg-indigo-600 text-white'
                    : 'border-indigo-200 bg-white text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {(questionFor === 'All' || questionFor === 'Owner') && (
          <FaqSection
            title="Owner FAQ"
            description="Information about verification and publishing your property."
            questions={ownerFaqs}
          />
        )}
        {(questionFor === 'All' || questionFor === 'Renter') && (
          <FaqSection
            title="Renter FAQ"
            description="Tips for evaluating listings and managing your booking."
            questions={renterFaqs}
          />
        )}
        <div className="mt-10 border-t border-slate-200 pt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
          >
            <span aria-hidden="true">←</span>
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
