import { extractDescriptionParts } from "@/utils/extractKeyTraits";
import React from "react";

type AIProfileProps = {
  description: string;
  diploma: string;
  firstJob: string;
  firstMajor: string;
  hobby: string;
  letter: string;
  secondJob: string;
  secondMajor: string;
};

const AIProfile: React.FC<AIProfileProps> = ({
  description,
  diploma,
  firstJob,
  firstMajor,
  hobby,
  letter,
  secondJob,
  secondMajor,
}) => {

  const descriptionParts = extractDescriptionParts(description);

  return (
    <div className="bg-[#262626] text-white rounded-lg p-6 max-w-2xl mx-auto shadow-lg">
      <div className="flex items-center mb-3">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
          AI
        </div>
        <h3 className="text-lg font-semibold"> 🧠 Personality & Career Profile</h3>
      </div>
      <div className="border-l-4 border-blue-500 pl-4 mb-4">
        <p className="text-gray-400 italic">
          {descriptionParts?.intro}
        </p>
      </div>
      { descriptionParts?.keyTraits?.length == 0 && 
        descriptionParts?.keyTraits?.length == 0 &&
        <div className="space-y-3">
          <h4 className="text-md font-semibold text-gray-300 pt-6">Description</h4>
          <ul className="list-disc list-inside text-gray-200 space-y-1">
            <p className="text-gray-400 italic">
              {description}
            </p>
          </ul>
        </div>
      }
      { descriptionParts?.keyTraits?.length !== 0 && 
        <div className="space-y-3">
          <h4 className="text-md font-semibold text-gray-300 pt-6">Key Traits</h4>
          <ul className="list-disc list-inside text-gray-200 space-y-1">
            { descriptionParts?.keyTraits?.map((trait, index) => (
              <li key={index}>{trait}</li>
            ))}
          </ul>
        </div>
      }
      { descriptionParts?.adventurousCreativeSide.length !== 0 &&
        <div className="space-y-3 pt-6">
          <h4 className="text-md font-semibold text-gray-300">Adventurous and Creative Side</h4>
          <ul className="list-disc list-inside text-gray-200 space-y-1">
            { descriptionParts?.adventurousCreativeSide?.map((trait, index) => (
              <li key={index}>{trait}</li>
            ))}
          </ul>
        </div>
      }
      <div className="mt-6 space-y-3">
        <h4 className="text-md font-semibold text-gray-300">🎓 Education & 💼 Career Journey</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-[#3a3a3a] p-3 rounded-lg">
            <p className="text-gray-400 text-sm">First Major</p>
            <p className="text-white font-medium">{firstMajor}</p>
          </div>
          <div className="bg-[#3a3a3a] p-3 rounded-lg">
            <p className="text-gray-400 text-sm">First Job</p>
            <p className="text-white font-medium">{firstJob}</p>
          </div>
          <div className="bg-[#3a3a3a] p-3 rounded-lg">
            <p className="text-gray-400 text-sm">Second Major</p>
            <p className="text-white font-medium">{secondMajor}</p>
          </div>
          <div className="bg-[#3a3a3a] p-3 rounded-lg">
            <p className="text-gray-400 text-sm">Second Job</p>
            <p className="text-white font-medium">{secondJob}</p>
          </div>
          <div className="bg-[#3a3a3a] p-3 rounded-lg">
            <p className="text-gray-400 text-sm">Diploma</p>
            <p className="text-white font-medium">{diploma}</p>
          </div>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <h4 className="text-md font-semibold text-gray-300">🎤 Personal Interests</h4>
        <div className="bg-[#3a3a3a] p-3 rounded-lg inline-block">
          <p className="text-gray-400 text-sm">Hobby</p>
          <p className="text-white font-medium">{hobby}</p>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <h4 className="text-md font-semibold text-gray-300">🔤 Profile Code</h4>
        <div className="bg-[#3a3a3a] p-3 rounded-lg inline-block">
          <p className="text-gray-400 text-sm">Letter Code</p>
          <p className="text-white font-medium">{letter}</p>
        </div>
      </div>
    </div>
  );
};

export default AIProfile;