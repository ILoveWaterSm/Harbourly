export default function TermsPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-heading text-4xl font-bold text-primary-text mb-4">Terms of Service</h1>
        <p className="text-secondary-text text-sm mb-8">Last updated: January 2025</p>
        <div className="card p-8 prose prose-sm max-w-none text-secondary-text space-y-4">
          <p>By using Harbourly, you agree to these terms. This is an MVP placeholder — full terms will be published before launch.</p>
          <h2 className="font-heading font-semibold text-primary-text text-lg">Key principles</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>All coaches must be verified before accepting bookings.</li>
            <li>Reviews must be tied to real, completed bookings.</li>
            <li>Harbourly prohibits guaranteed rank boost claims.</li>
            <li>Disputes are reviewed within 72 hours.</li>
            <li>Platform fee is 10% of the session rate.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
