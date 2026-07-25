import { Shell } from "@/components/shell";

export default function ResourcesLoading() {
  return (
    <Shell>
      <div className="resource-loader-head">
        <span className="skeleton skeleton-line short"/>
        <span className="skeleton skeleton-title"/>
        <span className="skeleton skeleton-line long"/>
      </div>
      <section className="resource-loader-status card">
        <span className="loader-orbit"><i/><i/><i/></span>
        <div><strong>Searching the web for you</strong><p>Matching trusted study material to your goal and skill gaps...</p></div>
      </section>
      {[0, 1].map((section) => (
        <section className="resource-loader-section" key={section}>
          <div className="skeleton skeleton-section-title"/>
          <div className="resource-grid">
            {[0, 1, 2].map((card) => (
              <div className="resource-card card resource-card-skeleton" key={card}>
                <span className="skeleton skeleton-pill"/>
                <span className="skeleton skeleton-card-title"/>
                <span className="skeleton skeleton-line long"/>
                <span className="skeleton skeleton-line medium"/>
                <span className="skeleton skeleton-line short"/>
              </div>
            ))}
          </div>
        </section>
      ))}
    </Shell>
  );
}
