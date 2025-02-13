import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-4 flex flex-col gap-6 leading-relaxed text-center max-w-xl">
        <p className="flex flex-row justify-center gap-3 items-center">
          <Image
            width={120}
            height={120}
            className="bg-slate-300 p-4"
            src="/images/austin_ai_logo.png"
            alt="Austin AI Allaince Logo"
          />
        </p>
        <p>
          The{" "}
          <Link
            className="font-medium underline underline-offset-4"
            href="https://www.austin-ai.org/"
            target="_blank"
          >
            Austin AI Alliance
          </Link>{" "}
          brings together companies, universities, non-profits, professional
          associations, and AI professionals to advance AI awareness,
          development, and responsible usage in Austin.
        </p>
        <p>
          Our vision is to make Austin a world-class hub for AI by fostering
          innovation, collaboration, and education across industries. We work to{" "}
          <code className="rounded-md bg-muted px-1 py-0.5">
            advance AI research
          </code>
          ,{" "}
          <code className="rounded-md bg-muted px-1 py-0.5">
            accelerate AI adoption
          </code>
          , and{" "}
          <code className="rounded-md bg-muted px-1 py-0.5">
            promote responsible AI
          </code>{" "}
          practices that emphasize ethics, diversity, and inclusion.
        </p>
        {/* <p>
          Join one of our{" "}
          <Link
            className="font-medium underline underline-offset-4"
            href="https://www.austin-ai.org/about/"
            target="_blank"
          >
            working groups
          </Link>{" "}
          to contribute to AI initiatives in membership, partnerships, workforce
          development, events, and more.
        </p> */}
      </div>
    </motion.div>
  );
};
