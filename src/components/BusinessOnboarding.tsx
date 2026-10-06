import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "../lib/supabaseClient";
import {
  Store,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Camera,
  Info,
} from "lucide-react";
import { SHOP_CATEGORIES } from "../lib/constants";
import { toast } from "sonner";
import { Badge, Button, Textarea, inputClasses } from "./ui";

interface OnboardingProps {
  onComplete: () => void;
}

const BusinessOnboarding = ({ onComplete }: OnboardingProps) => {
  const { user } = useUser(); // This gives the user.id, user.fullName, etc from Clerk.
  const [step, setStep] = useState(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    location: "",
    description: "",
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    if (!user) {
      toast.error("You need to sign in to create a business");
      return;
    }
    if (!imageFile) {
      toast.error("Please upload a shop photo");
      return;
    }

    setSubmitting(true);
    try {
      // Uploading Image — must live in the user's own folder:
      // RLS/storage policies only allow "<clerk_uid>/<filename>"
      const fileName = `${user.id}/${Date.now()}`;
      const { error: uploadError } = await supabase.storage
        .from("shop-images")
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      // Get the specific string URL
      const { data: urlData } = supabase.storage
        .from("shop-images")
        .getPublicUrl(fileName);

      if (!urlData?.publicUrl) {
        throw new Error("Could not build the image URL");
      }

      const publicUrl = urlData.publicUrl;

      // Insert into Database
      const { error: dbError } = await supabase.from("shops").insert([
        {
          owner_id: user.id,
          name: formData.name,
          category: formData.category,
          location: formData.location,
          description: formData.description,
          image_url: publicUrl, // Saving the string link
        },
      ]);

      if (dbError) throw dbError;

      toast.success("Business created!", { description: "Welcome to Q-LINE." });
      onComplete();
    } catch (error) {
      toast.error("Failed to create business", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-7 md:p-9 bg-card rounded-xl border-2 border-ink shadow-[6px_6px_0_0_var(--ink)]">
      {/* Progress Bar */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded transition-all duration-500 ${step >= i ? "bg-accent" : "bg-line"}`}
          />
        ))}
        <span className="font-mono text-[10px] text-ink-muted self-center ml-2">
          {step}/4
        </span>
      </div>

      {/* STEP 1: NAME */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <header>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-bold mb-2">
              Step 01
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-ink">
              The basics
            </h2>
            <p className="text-ink-muted font-medium text-lg">
              What's the name of your business?
            </p>
          </header>
          <div className="relative">
            <Store
              className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
              size={18}
            />
            <input
              autoFocus
              className={inputClasses + " pl-11 text-lg font-bold"}
              placeholder="e.g. The Razor's Edge"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <Button
            disabled={!formData.name}
            onClick={handleNext}
            size="lg"
            className="w-full"
          >
            Next <ArrowRight size={16} />
          </Button>
        </div>
      )}

      {/* STEP 2: DETAILS */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
          <header>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-bold mb-2">
              Step 02
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-ink">
              Location
            </h2>
            <p className="text-ink-muted font-medium text-lg">
              Help customers find you.
            </p>
          </header>
          <div className="space-y-4">
            <select
              className={inputClasses + " cursor-pointer font-bold"}
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              {SHOP_CATEGORIES.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
            <div className="relative">
              <MapPin
                className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
                size={18}
              />
              <input
                className={inputClasses + " pl-11 font-bold"}
                placeholder="Business Address"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
          </div>
          <Button
            disabled={!formData.location}
            onClick={handleNext}
            size="lg"
            className="w-full"
          >
            Looking good <ArrowRight size={16} />
          </Button>
        </div>
      )}

      {/* STEP 3: PHOTO & DESCRIPTION */}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
          <header>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-bold mb-2">
              Step 03
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-ink">
              Shop profile
            </h2>
            <p className="text-ink-muted font-medium text-lg">
              Make a great first impression.
            </p>
          </header>

          <div className="space-y-4">
            <div
              onClick={() => document.getElementById("fileInput")?.click()}
              className="relative w-full h-48 border-2 border-dashed border-line rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors overflow-hidden bg-surface group"
            >
              {preview ? (
                <img
                  src={preview}
                  className="w-full h-full object-cover"
                  alt="Preview"
                />
              ) : (
                <div className="text-center">
                  <Camera
                    className="mx-auto text-ink-muted mb-2 group-hover:text-accent transition-colors"
                    size={30}
                  />
                  <p className="font-mono text-xs font-bold text-ink-muted uppercase tracking-[0.14em]">
                    Upload shop photo
                  </p>
                </div>
              )}
              <input
                id="fileInput"
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-[10px] text-ink-muted uppercase tracking-[0.2em] font-bold ml-1 flex items-center gap-1">
                <Info size={13} /> Shop description
              </label>
              <Textarea
                className="h-32"
                placeholder="Tell customers about your services..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          <Button
            disabled={!formData.description || !imageFile}
            onClick={handleNext}
            size="lg"
            className="w-full"
          >
            Final review <ArrowRight size={16} />
          </Button>
        </div>
      )}

      {/* STEP 4: REVIEW */}
      {step === 4 && (
        <div className="text-center space-y-6 animate-in zoom-in-95">
          <header>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-bold mb-2">
              Step 04
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-ink">
              Confirm launch
            </h2>
            <p className="text-ink-muted font-medium">
              This is how your shop will look on Explore.
            </p>
          </header>

          {/* Shop Card Preview */}
          <div className="bg-card border border-line rounded-xl overflow-hidden text-left mx-auto max-w-sm">
            <div className="h-40 bg-surface">
              {preview && (
                <img
                  src={preview}
                  className="w-full h-full object-cover"
                  alt="Final"
                />
              )}
            </div>
            <div className="p-4 space-y-1">
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-extrabold text-lg tracking-tight">
                  {formData.name}
                </h3>
                <Badge variant="accent">{formData.category}</Badge>
              </div>
              <p className="text-ink-muted text-sm flex items-center gap-1">
                <MapPin size={13} /> {formData.location}
              </p>
              <p className="text-ink-muted text-sm line-clamp-2 mt-2">
                {formData.description}
              </p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="ghost" onClick={handleBack} className="flex-1">
              Back
            </Button>
            <Button
              onClick={() => handleSubmit()}
              disabled={submitting}
              size="lg"
              className="flex-[2]"
            >
              <CheckCircle2 size={17} />{" "}
              {submitting ? "Creating…" : "Create business"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessOnboarding;
