export default function About({ bio = '' }) {
  return (
    <section>
      <h2>About</h2>
      <p>{bio}</p>
    </section>
  );
}
