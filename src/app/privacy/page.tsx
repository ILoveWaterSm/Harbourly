export default function PrivacyPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-heading text-4xl font-bold text-primary-text mb-4">Privacy Policy</h1>
        <p className="text-secondary-text text-sm mb-8">Last updated: January 2025</p>
        <div className="card p-8 prose prose-sm max-w-none text-secondary-text space-y-4">
          <p>This is an MVP placeholder. Our full privacy policy will be published before launch.</p>
          <h2 className="font-heading font-semibold text-primary-text text-lg">What we collect</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>Email address, name, and password (hashed)</li>
            <li>Booking and session data</li>
            <li>Messages within booking sessions</li>
            <li>Coach verification proof (URLs)</li>
          </ul>
          <h2 className="font-heading font-semibold text-primary-text text-lg">How we use it</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>To operate the platform</li>
            <li>To verify coaches and protect the community</li>
            <li>To resolve disputes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
