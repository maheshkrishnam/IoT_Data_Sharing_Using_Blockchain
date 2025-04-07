import { useState } from "react";
import { useContract } from "../hooks/useContract";
import { toast } from "react-hot-toast";

export function VerificationPanel() {
  const [tokenId, setTokenId] = useState("");
  const [comments, setComments] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [verificationInProgress, setVerificationInProgress] = useState(false);

  const { data: pendingVerifications = [] } = useContract(
    "DataVerification",
    "getPendingVerifications"
  );

  const { execute: verify } = useContract("DataVerification", "verifyData");

  const handleVerify = async () => {
    if (!tokenId) {
      toast.error("Please select a data item to verify");
      return;
    }

    setVerificationInProgress(true);
    try {
      await verify([tokenId, isValid, comments]);
      toast.success(`Data ${isValid ? "approved" : "rejected"}!`);
      setTokenId("");
      setComments("");
      setIsValid(true);
    } catch (error) {
      toast.error(
        `Verification failed: ${error.shortMessage || error.message}`
      );
    } finally {
      setVerificationInProgress(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-6">
      <h3 className="font-bold mb-3">Data Verification Panel</h3>

      <div className="space-y-4">
        <select
          className="w-full p-2 border rounded"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        >
          <option value="">Select data to verify</option>
          {pendingVerifications.map((item) => (
            <option key={item.tokenId} value={item.tokenId}>
              NFT #{item.tokenId} - {item.dataType}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Verification comments"
          className="w-full p-2 border rounded"
          rows={3}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex gap-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                checked={isValid}
                onChange={() => setIsValid(true)}
              />
              <span className="ml-2">Valid</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                checked={!isValid}
                onChange={() => setIsValid(false)}
              />
              <span className="ml-2">Invalid</span>
            </label>
          </div>

          <button
            onClick={handleVerify}
            disabled={verificationInProgress || !tokenId}
            className={`px-4 py-2 rounded text-white ${
              verificationInProgress
                ? "bg-gray-400"
                : isValid
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {verificationInProgress ? "Processing..." : "Submit Verification"}
          </button>
        </div>
      </div>
    </div>
  );
}
