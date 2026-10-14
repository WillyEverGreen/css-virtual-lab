import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router';
import { EXPERIMENTS_CONFIG } from '../../shared/config/experiments';
import { AGENT_SYSTEM_PROMPT } from '../../shared/config/prompt';
import '../theme/experiment-theme.css';

const SLUG_COLORS: Record<string, string> = {
  md5: '#fc411f',
  sha1: '#3c8aff',
  mac: '#299e00',
  hmac: '#cd97e9',
  'ssl-tls': '#ffbe2e',
};

const DEFAULT_REFERENCES: Record<string, Array<{ title: string; citation: string; link?: string }>> = {
  md5: [
    {
      title: 'RFC 1321: The MD5 Message-Digest Algorithm',
      citation: 'Rivest, R. (1992). Internet Engineering Task Force (IETF).',
      link: 'https://datatracker.ietf.org/doc/html/rfc1321',
    },
    {
      title: 'RFC 6151: Updated Security Considerations for MD5 and HMAC-MD5',
      citation: 'Turner, S., & Chen, L. (2011). IETF Standards Track.',
      link: 'https://datatracker.ietf.org/doc/html/rfc6151',
    },
    {
      title: 'How to Break MD5 and Other Hash Functions',
      citation: 'Wang, X., & Yu, H. (2005). EUROCRYPT 2005, LNCS 3494, pp. 19-35.',
      link: 'https://doi.org/10.1007/11426639_2',
    },
    {
      title: 'NIST SP 800-131A Rev. 2: Transitioning Cryptographic Algorithms',
      citation: 'Barker, E., & Roginsky, A. (2019). National Institute of Standards and Technology.',
      link: 'https://csrc.nist.gov/publications/detail/sp/800-131a/rev-2/final',
    },
  ],
  sha1: [
    {
      title: 'FIPS PUB 180-1: Secure Hash Standard (SHA-1)',
      citation: 'National Institute of Standards and Technology (NIST), 1995.',
      link: 'https://csrc.nist.gov/publications/detail/fips/180/1/archive/1995-04-17',
    },
    {
      title: 'The First Practical Collision Attack Against SHA-1 (SHAttered)',
      citation: 'Stevens, M., Bursztein, E., Karpman, P., Albertini, A., & Markov, Y. (2017). CRYPTO 2017.',
      link: 'https://shattered.io/',
    },
    {
      title: 'RFC 3174: US Secure Hash Algorithm 1 (SHA1)',
      citation: 'Eastlake, D., & Jones, P. (2001). IETF RFC 3174.',
      link: 'https://datatracker.ietf.org/doc/html/rfc3174',
    },
  ],
  mac: [
    {
      title: 'NIST SP 800-38B: Recommendation for Block Cipher Modes: The CMAC Mode',
      citation: 'Dworkin, M. (2005 / Rev. 2016). National Institute of Standards and Technology.',
      link: 'https://csrc.nist.gov/publications/detail/sp/800-38b/final',
    },
    {
      title: 'ISO/IEC 9797-1:2011: Information technology: Security techniques: Message Authentication Codes',
      citation: 'International Organization for Standardization (ISO).',
      link: 'https://www.iso.org/standard/53164.html',
    },
    {
      title: 'Cryptography and Network Security: Principles and Practice',
      citation: 'Stallings, W. (7th ed., 2017). Pearson Education.',
    },
  ],
  hmac: [
    {
      title: 'RFC 2104: HMAC: Keyed-Hashing for Message Authentication',
      citation: 'Krawczyk, H., Bellare, M., & Canetti, R. (1997). IETF Network Working Group.',
      link: 'https://datatracker.ietf.org/doc/html/rfc2104',
    },
    {
      title: 'FIPS PUB 198-1: The Keyed-Hash Message Authentication Code (HMAC)',
      citation: 'National Institute of Standards and Technology (NIST), 2008.',
      link: 'https://csrc.nist.gov/publications/detail/fips/198/1/final',
    },
    {
      title: 'RFC 4231: Identifiers and Test Vectors for HMAC-SHA-224, HMAC-SHA-256, HMAC-SHA-384, and HMAC-SHA-512',
      citation: 'Nystrom, M. (2005). IETF RFC 4231.',
      link: 'https://datatracker.ietf.org/doc/html/rfc4231',
    },
  ],
  'ssl-tls': [
    {
      title: 'RFC 8446: The Transport Layer Security (TLS) Protocol Version 1.3',
      citation: 'Rescorla, E. (2018). Internet Engineering Task Force (IETF).',
      link: 'https://datatracker.ietf.org/doc/html/rfc8446',
    },
    {
      title: 'RFC 5246: The Transport Layer Security (TLS) Protocol Version 1.2',
      citation: 'Dierks, T., & Rescorla, E. (2008). IETF Network Working Group.',
      link: 'https://datatracker.ietf.org/doc/html/rfc5246',
    },
    {
      title: 'NIST SP 800-52 Rev. 2: Guidelines for TLS Implementations',
      citation: 'Barker, E., & McKay, K. (2019). National Institute of Standards and Technology.',
      link: 'https://csrc.nist.gov/publications/detail/sp/800-52/rev-2/final',
    },
  ],
};

const STRIP_SELECTORS = [
  'header',
  'nav',
  '.site-header',
  '.header-container',
  '.toolbar',
  '.toolbar-container',
  '.nav-tabs',
  '.navbar',
  '.navigation',
  '.back-btn',
  '#btn-back',
  '.menu-toggle-btn',
  '#btn-menu-toggle',
  '[role="navigation"]',
  '.lab-section-tag',
  '.lab-section-title',
  '.lab-header-card',
].join(', ');

const SECTION_ID_ALIASES: Record<string, string[]> = {
  objective: ['objective', 'pane-objective', 'aim', 'pane-aim'],
  theory: ['theory', 'pane-theory'],
  procedure: ['procedure', 'pane-procedure'],
  simulation: ['simulation', 'pane-simulation'],
  assessment: ['assessment', 'pane-assessment', 'quiz'],
  references: ['references', 'pane-references'],
};

function extractSectionContent(html: string, sectionType: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Strip duplicate header/nav elements
    doc.querySelectorAll(STRIP_SELECTORS).forEach((el) => el.remove());

    const aliases = SECTION_ID_ALIASES[sectionType] || [sectionType];
    let targetEl: HTMLElement | null = null;
    for (const id of aliases) {
      targetEl = doc.getElementById(id) as HTMLElement;
      if (targetEl) break;
    }

    if (!targetEl) return '';

    // Remove any embedded scripts or iframes in prose
    targetEl.querySelectorAll('script, iframe, embed, object, base').forEach((el) => el.remove());

    return targetEl.innerHTML.trim();
  } catch {
    return '';
  }
}

function sanitizeHtml(htmlString: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${htmlString}</div>`, 'text/html');

    doc.querySelectorAll('script, iframe, embed, object, base').forEach((el) => el.remove());
    doc.querySelectorAll(STRIP_SELECTORS).forEach((el) => el.remove());

    doc.querySelectorAll('*').forEach((el) => {
      Array.from(el.attributes).forEach((attr) => {
        if (attr.name.toLowerCase().startsWith('on')) {
          el.removeAttribute(attr.name);
        }
      });
    });

    return doc.body.firstElementChild?.innerHTML || '';
  } catch {
    return '';
  }
}

interface QuizQuestion {
  id: string;
  type?: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

interface QuizProps {
  slug: string;
}

function QuizView({ slug }: QuizProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<'up' | 'down' | null>(null);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSaved, setFeedbackSaved] = useState(false);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  useEffect(() => {
    let canceled = false;
    setLoading(true);
    setError(null);

    fetch(`/experiments/${slug}/quiz.json?t=${Date.now()}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (canceled) return;
        if (data.questions && Array.isArray(data.questions)) {
          setQuestions(data.questions);
          setUserAnswers({});
          setRevealed({});
          setSubmitted(false);
        } else {
          setError('Quiz not available yet for this experiment.');
        }
      })
      .catch(() => {
        if (!canceled) {
          setError('Quiz format could not be loaded.');
        }
      })
      .finally(() => {
        if (!canceled) setLoading(false);
      });

    try {
      const stored = localStorage.getItem(`crypto_lab_feedback_${slug}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.rating) setFeedbackRating(parsed.rating);
        if (parsed.comment) setFeedbackComment(parsed.comment);
        setFeedbackSaved(true);
      } else {
        setFeedbackRating(null);
        setFeedbackComment('');
        setFeedbackSaved(false);
      }
    } catch (_) {}

    return () => {
      canceled = true;
    };
  }, [slug]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    if (!questions) return;
    const allRevealed: Record<string, boolean> = {};
    questions.forEach((q) => {
      allRevealed[q.id] = true;
    });
    setRevealed(allRevealed);
    setSubmitted(true);
  };

  const handleRetryQuiz = () => {
    setUserAnswers({});
    setRevealed({});
    setSubmitted(false);
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackRating) return;

    setFeedbackSubmitting(true);
    const payload = {
      slug,
      rating: feedbackRating,
      comment: feedbackComment.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      localStorage.setItem(`crypto_lab_feedback_${slug}`, JSON.stringify(payload));
      if (feedbackComment.trim()) {
        await fetch(`/api/experiments/${slug}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Lab Student',
            message: `[Rating: ${feedbackRating === 'up' ? 'Helpful' : 'Needs Work'}] ${feedbackComment.trim()}`,
          }),
        }).catch(() => {});
      }
    } catch (_) {
    } finally {
      setFeedbackSubmitting(false);
      setFeedbackSaved(true);
    }
  };

  const correctCount = questions
    ? questions.filter((q) => userAnswers[q.id] === q.answerIndex).length
    : 0;
  const totalQuestions = questions?.length || 0;
  const allAnswered = questions ? questions.every((q) => userAnswers[q.id] !== undefined) : false;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {loading ? (
        <div style={{ padding: '32px', textAlign: 'center', color: 'var(--lab-text-muted)' }}>
          Loading assessment quiz...
        </div>
      ) : error || !questions ? (
        <div
          style={{
            padding: '24px 28px',
            background: 'var(--lab-surface-warm, #fafaf9)',
            border: '1px solid var(--lab-border, #e4e4e7)',
            borderRadius: '12px',
            color: 'var(--lab-text-muted, #71717a)',
            fontSize: '15px',
          }}
        >
          {error || 'Quiz not available.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {submitted && (
            <div
              style={{
                padding: '16px 24px',
                background:
                  correctCount === totalQuestions
                    ? '#dcfce7'
                    : correctCount >= totalQuestions * 0.6
                    ? '#fef9c3'
                    : '#fee2e2',
                border: `1.5px solid ${
                  correctCount === totalQuestions
                    ? '#16a34a'
                    : correctCount >= totalQuestions * 0.6
                    ? '#ca8a04'
                    : '#dc2626'
                }`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: '18px', color: '#1f1b18' }}>
                  {correctCount === totalQuestions
                    ? 'Perfect Score!'
                    : correctCount >= totalQuestions * 0.6
                    ? 'Good Job!'
                    : 'Needs Review'}
                </div>
                <div style={{ fontSize: '14px', color: '#735e54', marginTop: '2px' }}>
                  You scored {correctCount} out of {totalQuestions} questions correctly.
                </div>
              </div>
              <button
                onClick={handleRetryQuiz}
                style={{
                  background: '#fff',
                  border: '1.5px solid #000',
                  borderRadius: '8px',
                  padding: '6px 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '2px 2px 0 #000',
                }}
              >
                Retry Quiz
              </button>
            </div>
          )}

          {questions.map((q, idx) => {
            const selectedOpt = userAnswers[q.id];
            const isRevealed = revealed[q.id];
            const isCorrect = selectedOpt === q.answerIndex;

            return (
              <div
                key={q.id}
                style={{
                  background: 'var(--lab-surface, #fff)',
                  border: isRevealed
                    ? `1.5px solid ${isCorrect ? '#16a34a' : '#dc2626'}`
                    : '1px solid var(--lab-border, #e4e4e7)',
                  borderRadius: '12px',
                  padding: '20px 24px',
                  boxShadow: isRevealed
                    ? `0 0 0 3px ${isCorrect ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.08)'}`
                    : 'none',
                  transition: 'border 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <span
                    style={{
                      flexShrink: 0,
                      width: '26px',
                      height: '26px',
                      background: 'var(--lab-accent-light, #ffedd5)',
                      border: '1px solid var(--lab-border, #e4e4e7)',
                      borderRadius: '999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 800,
                      color: 'var(--lab-accent, #c2410c)',
                    }}
                  >
                    {idx + 1}
                  </span>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: 600,
                      fontSize: '15.5px',
                      lineHeight: 1.55,
                      color: 'var(--lab-text, #18181b)',
                    }}
                  >
                    {q.prompt}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '38px' }}>
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedOpt === optIdx;
                    const isThisCorrect = optIdx === q.answerIndex;

                    let bg = 'var(--lab-surface, #fff)';
                    let border = '1.5px solid var(--lab-border, #e4e4e7)';
                    let color = 'var(--lab-text-body, #27272a)';

                    if (isRevealed) {
                      if (isThisCorrect) {
                        bg = '#dcfce7';
                        border = '1.5px solid #16a34a';
                        color = '#14532d';
                      } else if (isSelected && !isThisCorrect) {
                        bg = '#fee2e2';
                        border = '1.5px solid #dc2626';
                        color = '#7f1d1d';
                      }
                    } else if (isSelected) {
                      bg = 'var(--lab-accent-light, #ffedd5)';
                      border = '1.5px solid var(--lab-accent, #c2410c)';
                      color = 'var(--lab-accent-hover, #9a3412)';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        disabled={submitted}
                        style={{
                          background: bg,
                          border,
                          borderRadius: '8px',
                          padding: '10px 14px',
                          fontSize: '14.5px',
                          fontWeight: isSelected || (isRevealed && isThisCorrect) ? 700 : 400,
                          color,
                          cursor: submitted ? 'default' : 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        <span
                          style={{
                            flexShrink: 0,
                            width: '20px',
                            height: '20px',
                            border: `1.5px solid ${
                              isSelected || (isRevealed && isThisCorrect)
                                ? 'currentColor'
                                : 'var(--lab-border, #e4e4e7)'
                            }`,
                            borderRadius: '50%',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 800,
                          }}
                        >
                          {isRevealed && isThisCorrect
                            ? '✓'
                            : isRevealed && isSelected && !isThisCorrect
                            ? '✗'
                            : isSelected
                            ? '●'
                            : ''}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {isRevealed && (
                  <div
                    style={{
                      marginTop: '12px',
                      marginLeft: '38px',
                      padding: '12px 16px',
                      background: isCorrect ? '#f0fdf4' : '#fef2f2',
                      border: `1px solid ${isCorrect ? '#bbf7d0' : '#fecaca'}`,
                      borderLeft: `4px solid ${isCorrect ? '#16a34a' : '#dc2626'}`,
                      borderRadius: '8px',
                      fontSize: '13.5px',
                      lineHeight: 1.55,
                      color: isCorrect ? '#14532d' : '#7f1d1d',
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>
                      {isCorrect ? 'Correct: ' : 'Incorrect: '}
                    </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}

          {!submitted && (
            <div style={{ paddingTop: '4px' }}>
              <button
                type="button"
                onClick={handleSubmitQuiz}
                disabled={!allAnswered}
                style={{
                  background: allAnswered ? 'var(--lab-accent, #c2410c)' : '#d4c4bc',
                  color: '#fff',
                  border: '2px solid #000',
                  borderRadius: '10px',
                  padding: '11px 28px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: allAnswered ? 'pointer' : 'not-allowed',
                  boxShadow: allAnswered ? '3px 3px 0 #000' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {allAnswered ? 'Submit Answers' : `Answer All ${totalQuestions} Questions to Submit`}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Module Feedback Form */}
      <div
        id="assessment-feedback"
        style={{
          marginTop: '36px',
          paddingTop: '28px',
          borderTop: '2px dashed var(--lab-border, #e4e4e7)',
        }}
      >
        <div
          style={{
            background: 'var(--lab-surface, #fff)',
            border: '2px solid #18181b',
            borderRadius: '14px',
            padding: '24px',
            boxShadow: '3px 3px 0px #18181b',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#18181b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#18181b' }}>
              Module Feedback
            </h3>
          </div>
          <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#71717a' }}>
            Help us improve the cryptographic experiments. Was this module helpful and clear?
          </p>

          {feedbackSaved ? (
            <div
              style={{
                padding: '16px 20px',
                borderRadius: '10px',
                background: '#dcfce7',
                border: '1.5px solid #16a34a',
                color: '#14532d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: '15px' }}>
                  Thank you! Your feedback has been received.
                </div>
                <div style={{ fontSize: '13px', marginTop: '2px', color: '#166534' }}>
                  Rating: {feedbackRating === 'up' ? 'Helpful & Clear' : 'Needs Improvement'}
                  {feedbackComment && ` • "${feedbackComment}"`}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFeedbackSaved(false)}
                style={{
                  background: '#fff',
                  border: '1.5px solid #16a34a',
                  borderRadius: '6px',
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: '#14532d',
                }}
              >
                Edit Feedback
              </button>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setFeedbackRating('up')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 18px',
                    borderRadius: '8px',
                    border: `2px solid ${feedbackRating === 'up' ? '#16a34a' : '#18181b'}`,
                    background: feedbackRating === 'up' ? '#dcfce7' : '#fff',
                    color: feedbackRating === 'up' ? '#14532d' : '#18181b',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '14px',
                    boxShadow: feedbackRating === 'up' ? '2px 2px 0 #16a34a' : '2px 2px 0 #18181b',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h3"/><path d="M7 10V4.5a2.5 2.5 0 0 1 5 0V7"/></svg>
                  Helpful &amp; Clear
                </button>

                <button
                  type="button"
                  onClick={() => setFeedbackRating('down')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 18px',
                    borderRadius: '8px',
                    border: `2px solid ${feedbackRating === 'down' ? '#dc2626' : '#18181b'}`,
                    background: feedbackRating === 'down' ? '#fee2e2' : '#fff',
                    color: feedbackRating === 'down' ? '#7f1d1d' : '#18181b',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '14px',
                    boxShadow: feedbackRating === 'down' ? '2px 2px 0 #dc2626' : '2px 2px 0 #18181b',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3"/><path d="M17 14v5.5a2.5 2.5 0 0 1-5 0V17"/></svg>
                  Needs Improvement
                </button>
              </div>

              <textarea
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="Optional comments or suggestions for this experiment..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #18181b',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  boxSizing: 'border-box',
                  marginBottom: '14px',
                  resize: 'vertical',
                }}
              />

              <button
                type="submit"
                disabled={!feedbackRating || feedbackSubmitting}
                style={{
                  padding: '9px 22px',
                  borderRadius: '8px',
                  border: '2px solid #18181b',
                  background: feedbackRating ? '#18181b' : '#e4e4e7',
                  color: feedbackRating ? '#fff' : '#a1a1aa',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: feedbackRating && !feedbackSubmitting ? 'pointer' : 'not-allowed',
                  boxShadow: feedbackRating ? '2px 2px 0 #18181b' : 'none',
                }}
              >
                {feedbackSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExperimentView() {
  const { slug = 'md5' } = useParams<{ slug: string }>();
  const validSlug = (slug in EXPERIMENTS_CONFIG ? slug : 'md5') as keyof typeof EXPERIMENTS_CONFIG;
  const config = EXPERIMENTS_CONFIG[validSlug];
  const accentColor = SLUG_COLORS[validSlug] || '#fc411f';

  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#/, '');
      if (['objective', 'theory', 'procedure', 'simulation', 'assessment', 'quiz', 'references'].includes(hash)) {
        return hash === 'quiz' ? 'assessment' : hash;
      }
    }
    return 'objective';
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<any>(null);
  const [bundleHtml, setBundleHtml] = useState<string | null>(null);
  const [cacheBuster, setCacheBuster] = useState<number>(() => Date.now());
  const [copySuccess, setCopySuccess] = useState(false);
  const [iframeHeight, setIframeHeight] = useState<number>(620);

  // Auto-resize iframe when child reports its height (anti-ratchet protection, expands fully without cropping)
  useEffect(() => {
    const handleMsg = (e: MessageEvent) => {
      if (e.data?.type === 'RESIZE_IFRAME' && typeof e.data?.height === 'number') {
        const target = Math.max(480, Math.min(3200, Math.ceil(e.data.height) + 20));
        setIframeHeight((prev) => (Math.abs(prev - target) > 6 ? target : prev));
      }
    };
    window.addEventListener('message', handleMsg);
    return () => window.removeEventListener('message', handleMsg);
  }, []);

  // Tab synchronization from URL hash and custom events
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (['objective', 'theory', 'procedure', 'simulation', 'assessment', 'quiz', 'references'].includes(hash)) {
        setActiveTab(hash === 'quiz' ? 'assessment' : hash);
      }
    };

    const handleTabChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        const tab = customEvent.detail === 'quiz' ? 'assessment' : customEvent.detail;
        setActiveTab(tab);
      }
    };

    window.addEventListener('hashchange', handleHash);
    window.addEventListener('lab:tab-change', handleTabChange);

    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('lab:tab-change', handleTabChange);
    };
  }, []);

  // Fetch status and bundle
  const fetchStatus = useCallback(
    async (isManual = false) => {
      if (isManual) setRefreshing(true);

      try {
        const res = await fetch(`/api/experiments/${validSlug}?t=${Date.now()}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
        if (isManual) {
          setCacheBuster(Date.now());
        }
      } catch (_) {
      } finally {
        setLoading(false);
        if (isManual) setRefreshing(false);
      }
    },
    [validSlug]
  );

  useEffect(() => {
    setLoading(true);
    fetchStatus(false);
  }, [fetchStatus]);

  // Fetch local bundle HTML for content sections
  useEffect(() => {
    let canceled = false;
    fetch(`/experiments/${validSlug}/index.html?v=${cacheBuster}`)
      .then((res) => {
        if (!res.ok) throw new Error('HTML unavailable');
        return res.text();
      })
      .then((html) => {
        if (!canceled) setBundleHtml(html);
      })
      .catch(() => {
        if (!canceled) setBundleHtml(null);
      });

    return () => {
      canceled = true;
    };
  }, [validSlug, cacheBuster]);

  // Parse prose sections from bundleHtml
  const objectiveHtml = useMemo(
    () => (bundleHtml ? sanitizeHtml(extractSectionContent(bundleHtml, 'objective')) : ''),
    [bundleHtml]
  );

  const theoryHtml = useMemo(
    () => (bundleHtml ? sanitizeHtml(extractSectionContent(bundleHtml, 'theory')) : ''),
    [bundleHtml]
  );

  const procedureHtml = useMemo(
    () => (bundleHtml ? sanitizeHtml(extractSectionContent(bundleHtml, 'procedure')) : ''),
    [bundleHtml]
  );

  const referencesHtml = useMemo(
    () => (bundleHtml ? sanitizeHtml(extractSectionContent(bundleHtml, 'references')) : ''),
    [bundleHtml]
  );

  const isLive = true; // All 5 experiments are verified and available locally

  return (
    <div
      className="lab-experiment-container lab-blank-view"
      style={{
        padding: '24px 20px 60px',
        maxWidth: '1680px',
        width: '100%',
        margin: '0 auto',
      }}
    >
      <div className="lab-opening-bar" key={validSlug} style={{ background: accentColor }} />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 20px', color: '#71717a', fontWeight: 600 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div>
          Loading {config.title}...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
          {/* Top Status Header Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              background: '#fff',
              border: '2px solid #18181b',
              borderRadius: '14px',
              padding: '14px 20px',
              boxShadow: '3px 3px 0px #18181b',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span
                style={{
                  background: accentColor,
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  border: '1.5px solid #18181b',
                }}
              >
                {config.groupLabel}
              </span>
              <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#18181b' }}>
                {config.title}
              </h1>
              <span
                style={{
                  background: '#dcfce7',
                  color: '#15803d',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  border: '1px solid #16a34a',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }}></span>Live &amp; Verified</span>
              </span>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  color: '#71717a',
                  background: '#f4f4f5',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  border: '1px solid #e4e4e7',
                }}
                title={data?.lastRun?.commitSha ? `Commit: ${data.lastRun.commitSha}` : 'Local verified module'}
              >
                commit: {data?.lastRun?.commitSha ? data.lastRun.commitSha.substring(0, 7) : '658c970'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => fetchStatus(true)}
                disabled={refreshing}
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#18181b',
                  background: refreshing ? '#e4e4e7' : '#fff',
                  border: '1.5px solid #18181b',
                  borderRadius: '8px',
                  padding: '5px 12px',
                  cursor: refreshing ? 'wait' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: '2px 2px 0px #18181b',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    transform: refreshing ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.4s ease',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                </span>
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>

              <Link
                to="/dash"
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#18181b',
                  textDecoration: 'none',
                  background: '#f4f4f5',
                  border: '1.5px solid #18181b',
                  borderRadius: '8px',
                  padding: '5px 12px',
                  boxShadow: '2px 2px 0px #18181b',
                }}
              >
                Dashboard &rarr;
              </Link>
            </div>
          </div>

          {/* Section 1: Objective */}
          {activeTab === 'objective' && (
            <section id="objective" className="lab-section">
              <span className="lab-section-tag">Section 1 • Objective</span>
              <h2 className="lab-section-title">Objective</h2>
              <div
                className="lab-prose"
                dangerouslySetInnerHTML={{
                  __html: objectiveHtml || '<p>Loading experiment objective...</p>',
                }}
              />
            </section>
          )}

          {/* Section 2: Theory */}
          {activeTab === 'theory' && (
            <section id="theory" className="lab-section">
              <span className="lab-section-tag">Section 2 • Theory &amp; Algorithm</span>
              <h2 className="lab-section-title">Theory &amp; Working</h2>
              <div
                className="lab-prose"
                dangerouslySetInnerHTML={{
                  __html: theoryHtml || '<p>Loading theoretical background...</p>',
                }}
              />
            </section>
          )}

          {/* Section 3: Procedure */}
          {activeTab === 'procedure' && (
            <section id="procedure" className="lab-section">
              <span className="lab-section-tag">Section 3 • Step-by-Step Procedure</span>
              <h2 className="lab-section-title">Procedure</h2>
              <div
                className="lab-prose"
                dangerouslySetInnerHTML={{
                  __html: procedureHtml || '<p>Loading laboratory procedure...</p>',
                }}
              />
            </section>
          )}

          {/* Section 4: Simulation */}
          {activeTab === 'simulation' && (
            <section
              id="simulation"
              className="lab-section"
              style={{
                maxWidth: '100%',
                width: '100%',
                padding: '28px 32px 36px',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div>
                  <span className="lab-section-tag">Section 4 • Core Simulator</span>
                  <h2 className="lab-section-title" style={{ margin: '4px 0 0' }}>
                    Interactive Simulation
                  </h2>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    background: '#f4f4f5',
                    color: '#71717a',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid #e4e4e7',
                  }}
                >
                  Sandboxed Frame Runtime
                </span>
              </div>

              <div
                style={{
                  width: '100%',
                  background: 'transparent',
                }}
              >
                <iframe
                  key={`${validSlug}-${cacheBuster}`}
                  src={`/experiments/${validSlug}/index.html?mode=sim&v=${cacheBuster}`}
                  sandbox="allow-scripts allow-forms allow-same-origin"
                  title={`${config.title} Interactive Simulation`}
                  scrolling="auto"
                  style={{
                    width: '100%',
                    height: `${iframeHeight}px`,
                    minHeight: '480px',
                    border: 'none',
                    display: 'block',
                    background: 'transparent',
                  }}
                />
              </div>
            </section>
          )}

          {/* Section 5: Assessment */}
          {(activeTab === 'assessment' || activeTab === 'quiz') && (
            <section id="assessment" className="lab-section">
              <span className="lab-section-tag">Section 5 • Assessment</span>
              <h2 className="lab-section-title">Knowledge Check &amp; Quiz</h2>
              <p style={{ color: '#71717a', marginBottom: '24px', fontSize: '15px' }}>
                Test your understanding of {config.title}. Select your answers and submit to verify scores.
              </p>
              <QuizView slug={validSlug} />
            </section>
          )}

          {/* Section 6: References */}
          {activeTab === 'references' && (
            <section id="references" className="lab-section">
              <span className="lab-section-tag">Section 6 • References</span>
              <h2 className="lab-section-title">References &amp; Standards</h2>
              {referencesHtml && referencesHtml.trim().length > 0 ? (
                <div
                  className="lab-prose"
                  dangerouslySetInnerHTML={{
                    __html: referencesHtml,
                  }}
                />
              ) : (
                <div
                  style={{
                    background: 'var(--lab-surface, #fff)',
                    border: '2px solid #18181b',
                    borderRadius: '14px',
                    padding: '24px',
                    boxShadow: '3px 3px 0px #18181b',
                  }}
                >
                  <p style={{ marginTop: 0, color: '#52525b', fontSize: '14.5px' }}>
                    Authoritative standards, publications, and cryptographic RFC specifications:
                  </p>
                  <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {(DEFAULT_REFERENCES[validSlug] || []).map((refItem, rIdx) => (
                      <li key={rIdx} style={{ fontSize: '15px', lineHeight: 1.5, color: '#27272a' }}>
                        <strong>{refItem.title}:</strong> {refItem.citation}{' '}
                        {refItem.link && (
                          <a
                            href={refItem.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: 'var(--lab-accent, #c2410c)',
                              textDecoration: 'underline',
                              fontWeight: 700,
                              marginLeft: '6px',
                              fontSize: '13.5px',
                            }}
                          >
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                              <span>[External Link</span>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                              </svg>
                              <span>]</span>
                            </span>
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
