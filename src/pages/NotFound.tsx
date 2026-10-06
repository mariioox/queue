import React from "react";
import { Link } from "react-router-dom";
import { buttonClasses, EmptyState } from "../components/ui";
import { Ticket } from "lucide-react";

const NotFound: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6">
    <p className="font-mono text-sm uppercase tracking-[0.3em] text-accent font-bold mb-3">
      Error 404
    </p>
    <h1 className="text-7xl font-extrabold tracking-tighter mb-4">404</h1>
    <EmptyState
      icon={<Ticket size={34} />}
      title="Lost in line?"
      description="The page you're looking for doesn't exist."
      action={
        <Link to="/" className={buttonClasses("primary", "md")}>
          Back to home
        </Link>
      }
    />
  </div>
);

export default NotFound;
