import React, { useState } from "react";
import { useReferral } from "../../hooks/useReferral";
import { Copy, Users, DollarSign, Link2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";
import Loading from "../Loading";

const GrowthPage: React.FC = () => {
  const {
    myReferralCode,
    downline,
    bonuses,
    loading,
    applyReferralCode,
    hasReferrer,
  } = useReferral();
  const [inputCode, setInputCode] = useState("");
  const { user, isLoaded } = useUser();
  const referralLink = `${window.location.origin}/?ref=${myReferralCode}`;

  const copyLink = () => {
    navigator.clipboard
      .writeText(referralLink)
      .then(() => {
        toast.success("Referral link copied!");
      })
      .catch((err) => {
        console.error("Failed to copy!", err);
        toast.error("Failed to copy link");
      });
  };

  const handleApplyCode = async () => {
    if (!inputCode.trim()) return;
    const code = inputCode.includes("ref=")
      ? inputCode.split("ref=")[1]
      : inputCode;
    await applyReferralCode(code);
    setInputCode("");
  };

  if (!isLoaded || loading) {
    return <Loading />;
  }

  const renderTree = (node: any) => (
    <li className="ml-6">
      <div className="bg-indigo-50 px-4 py-2 rounded-lg">
        <p className="font-medium">{node.firstName || node.id.slice(-8)}</p>
        <p className="text-sm text-gray-600">
          Level {node.level} • Active: ${node.active_invested || 0}
        </p>
      </div>
      {node.children && node.children.length > 0 && (
        <ul className="mt-2 border-l-2 border-indigo-200 pl-4">
          {node.children.map((child: any) => (
            <React.Fragment key={child.id}>{renderTree(child)}</React.Fragment>
          ))}
        </ul>
      )}
    </li>
  );

  return (
    <>
      <Toaster />
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        <h1 className="text-3xl font-bold">Growth & Referrals</h1>

        {/* My Referral */}
        <div className="bg-linear-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">Your Referral Link</h2>
          <div className="flex items-center gap-4">
            <code className="flex-1 bg-white/20 px-4 py-2 rounded-lg break-all">
              {referralLink}
            </code>
            <button
              onClick={copyLink}
              className="p-3 bg-white/20 rounded-lg hover:bg-white/30"
            >
              <Copy size={20} />
            </button>
          </div>
          <p className="mt-4 text-sm opacity-90">
            Share this link to invite friends and earn bonuses!
          </p>
        </div>

        {/* Apply Referral Code */}
        {!hasReferrer && (
          <div className="bg-gray-50 p-6 rounded-2xl">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Link2 size={20} /> Join Someone's Network
            </h3>
            <div className="flex gap-3">
              <input
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Enter referral code"
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <button
                onClick={handleApplyCode}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {/* Bonuses Earned */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-green-50 p-6 rounded-2xl text-center">
            <DollarSign className="w-10 h-10 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">
              ${bonuses.one_time_total.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">One-time Bonuses</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-2xl text-center">
            <Users className="w-10 h-10 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">
              ${bonuses.ongoing_total.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">Ongoing Active Bonus</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-2xl text-center">
            <DollarSign className="w-10 h-10 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">
              ${bonuses.grand_total.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">Total Bonuses Earned</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
            <Users size={24} className="text-indigo-600" />
            Your Referral Network (Up to 5 Levels)
          </h2>

          {downline && downline.children && downline.children.length > 0 ? (
            <div className="overflow-x-auto">
              <ul className="space-y-4">
                <li className="font-bold text-lg text-center mb-6">
                  You ({user?.firstName || user?.id.slice(-8)})
                  <div className="text-sm font-normal text-gray-600 mt-1">
                    Total Downline: {downline.children.length} direct • Bonuses:
                    ${bonuses.grand_total.toFixed(2)}
                  </div>
                </li>

                {downline.children.map((child: any) => (
                  <React.Fragment key={child.id}>
                    {renderTree(child)}
                  </React.Fragment>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Users size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No referrals yet</p>
              <p className="text-sm mt-2">
                Share your link to start building your network and earn bonuses!
              </p>
            </div>
          )}
        </div>

        {/* Bonus Rules Explanation */}
        <div className="bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4">How Bonuses Work</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="font-bold text-amber-600">
                • Level 1 (Direct)
              </span>
              <span>
                5% one-time on first investment + 2% ongoing on all active
                investments
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-amber-600">• Level 2</span>
              <span>2% one-time on first investment</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-amber-600">• Level 3</span>
              <span>1% one-time</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-amber-600">• Level 4</span>
              <span>0.5% one-time</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-amber-600">• Level 5</span>
              <span>0.25% one-time</span>
            </li>
            <li className="text-xs text-gray-600 mt-4">
              Ongoing 2% bonus applies only to your direct referrals (Level 1)
              as long as they have active investments.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default GrowthPage;
