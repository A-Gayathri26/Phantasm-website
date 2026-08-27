import Hero from "../components/Hero.jsx";
import RegistrationForm from "../components/RegistrationForm.jsx";

export default function Home() {
  return (
    <>
      <Hero />
      <section
        id="register"
        className="relative z-10 mx-auto max-w-6xl px-6 pb-20 sm:px-10"
      >
        <div data-reveal>
          <RegistrationForm />
        </div>
      </section>
    </>
  );
}
