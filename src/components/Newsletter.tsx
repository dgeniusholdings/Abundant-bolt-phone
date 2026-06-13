import { useState } from 'react';
import { ArrowRight, CheckCircle2, Mail } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 700);
  };

  return (
    <section className="py-10 md:py-14 bg-brand-500 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/8 rounded-full blur-2xl" />
      </div>

      <div className="container-padding relative">
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-5">
            <Mail className="w-5 h-5 text-white" />
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
            Get the best deals before they sell out
          </h2>
          <p className="text-brand-100 text-sm mb-6">
            Subscribe for exclusive offers and flash sale alerts — straight to your inbox.
          </p>

          {isSubmitted ? (
            <div className="flex items-center justify-center gap-2 bg-white/20 rounded-xl p-4 text-white">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span className="font-medium text-sm">You&apos;re in! Check your inbox.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 text-sm focus:bg-white/30 focus:border-white/50 transition-all"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-brand-600 font-bold rounded-lg hover:bg-brand-50 transition-colors text-sm whitespace-nowrap group"
              >
                {isLoading ? 'Subscribing...' : (
                  <>
                    Subscribe
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
          <p className="text-white/40 text-xs mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
}
