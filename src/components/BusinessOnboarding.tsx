import { useState } from "react";
import { useUser } from "@clerk/clerk-react"; // To get the owner's ID
import { supabase } from "../lib/supabaseClient"; // To send data to the backend
import {
  Store,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Camera,
  Info,
} from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

const BusinessOnboarding = ({ onComplete }: OnboardingProps) => {
  const { user } = useUser(); // This gives the user.id, user.fullName, etc from Clerk.
  const [step, setStep] = useState(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
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
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!user || !imageFile) return;

    try {
      // Uploading Image
      const fileName = `${user.id}-${Date.now()}`;
      const { error: uploadError } = await supabase.storage
        .from("shop-images")
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      // Get the specific string URL
      const { data: urlData } = supabase.storage
        .from("shop-images")
        .getPublicUrl(fileName);

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

      onComplete();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create business.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded-[2.5rem] shadow-xl border border-gray-100">
      {/* Progress Bar */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= i ? "bg-blue-600" : "bg-gray-100"}`}
          />
        ))}
      </div>

      {/* STEP 1: NAME */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <header>
            <h2 className="text-3xl font-black tracking-tight text-gray-900">
              The Basics
            </h2>
            <p className="text-gray-500 font-medium text-lg">
              What's the name of your business?
            </p>
          </header>
          <div className="relative">
            <Store
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              autoFocus
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-lg font-bold"
              placeholder="e.g. The Razor's Edge"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <button
            disabled={!formData.name}
            onClick={handleNext}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            Next <ArrowRight size={20} />
          </button>
        </div>
      )}

      {/* STEP 2: DETAILS */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
          <header>
            <h2 className="text-3xl font-black tracking-tight text-gray-900">
              Location
            </h2>
            <p className="text-gray-500 font-medium text-lg">
              Help customers find you.
            </p>
          </header>
          <div className="space-y-4">
            <select
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold outline-none cursor-pointer"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option>Barber</option>
              <option>Laundry</option>
              <option>Clinic</option>
              <option>Food</option>
              <option>Other</option>
            </select>
            <div className="relative">
              <MapPin
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold outline-none"
                placeholder="Business Address"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
          </div>
          <button
            disabled={!formData.location}
            onClick={handleNext}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            Looking good <ArrowRight size={20} />
          </button>
        </div>
      )}

      {/* STEP 3: PHOTO & DESCRIPTION */}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
          <header>
            <h2 className="text-3xl font-black tracking-tight text-gray-900">
              Shop Profile
            </h2>
            <p className="text-gray-500 font-medium text-lg">
              Make a great first impression.
            </p>
          </header>

          <div className="space-y-4">
            <div
              onClick={() => document.getElementById("fileInput")?.click()}
              className="relative w-full h-48 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-all overflow-hidden bg-gray-50 group"
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
                    className="mx-auto text-gray-400 mb-2 group-hover:text-blue-500 transition-colors"
                    size={32}
                  />
                  <p className="text-sm font-bold text-gray-500">
                    Upload Shop Photo
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
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-1">
                <Info size={14} /> Shop Description
              </label>
              <textarea
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-medium outline-none h-32 resize-none focus:ring-2 focus:ring-blue-600 transition-all"
                placeholder="Tell customers about your services..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          <button
            disabled={!formData.description || !imageFile}
            onClick={handleNext}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            Final Review <ArrowRight size={20} />
          </button>
        </div>
      )}

      {/* STEP 4: REVIEW */}
      {step === 4 && (
        <div className="text-center space-y-6 animate-in zoom-in-95">
          <header>
            <h2 className="text-3xl font-black tracking-tight text-gray-900">
              Confirm Launch
            </h2>
            <p className="text-gray-500 font-medium">
              This is how your shop will look on Explore.
            </p>
          </header>

          {/* Shop Card Preview */}
          <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm text-left mx-auto max-w-sm">
            <div className="h-40 bg-gray-200">
              {preview && (
                <img
                  src={preview}
                  className="w-full h-full object-cover"
                  alt="Final"
                />
              )}
            </div>
            <div className="p-4 space-y-1">
              <div className="flex justify-between items-start">
                <h3 className="font-black text-xl">{formData.name}</h3>
                <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
                  {formData.category}
                </span>
              </div>
              <p className="text-gray-500 text-sm flex items-center gap-1">
                <MapPin size={14} /> {formData.location}
              </p>
              <p className="text-gray-600 text-sm line-clamp-2 mt-2">
                {formData.description}
              </p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleBack}
              className="flex-1 py-4 font-bold text-gray-500"
            >
              Back
            </button>
            <button
              onClick={() => handleSubmit()}
              className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={20} /> Create Business
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessOnboarding;
