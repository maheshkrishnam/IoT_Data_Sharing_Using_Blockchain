import { useState} from "react";
import { useAccount, useReadContract } from "wagmi";
import { useContract } from "../hooks/useContract";
import { toast } from "react-hot-toast";
import { CONTRACTS } from "../constants/contracts";

export function RoleManager() {
  const { address } = useAccount();
  const [userAddress, setUserAddress] = useState("");
  const [role, setRole] = useState("device");

  // Get AccessControl contract details
  const accessControlContract = CONTRACTS["AccessControl"];

  // Default Admin Role Hash
  const DEFAULT_ADMIN_ROLE =
    "0x0000000000000000000000000000000000000000000000000000000000000000";

  // Check if the user is an admin
  const { data: isAdmin, isLoading: isAdminLoading } = useReadContract({
    address: accessControlContract.address,
    abi: accessControlContract.abi,
    functionName: "hasRole",
    args: [DEFAULT_ADMIN_ROLE, address],
  });

  // Define role-granting functions dynamically
  const roleFunctions = {
    device: "grantDeviceRole",
    verifier: "grantVerifierRole",
    dataBuyer: "grantDataBuyerRole",
  };

  // Hook for granting roles
  const { execute: grantRole } = useContract(
    "AccessControl",
    roleFunctions[role],
    [userAddress]
  );

  const handleGrantRole = async () => {
    if (!userAddress) {
      toast.error("Please enter a valid address");
      return;
    }

    try {
      await grantRole();
      toast.success(`Role granted successfully!`);
      setUserAddress("");
    } catch (error) {
      console.error("Grant role error:", error);
      toast.error(`Failed: ${error.message}`);
    }
  };

  if (isAdminLoading) return <p>Loading admin status...</p>;

  if (!isAdmin) return <p>You are not an admin.</p>;

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Grant Roles</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              className="p-2 border rounded"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="device">Device</option>
              <option value="verifier">Verifier</option>
              <option value="dataBuyer">Data Buyer</option>
            </select>
            <input
              type="text"
              placeholder="0x..."
              className="flex-1 p-2 border rounded"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
            />
            <button
              onClick={handleGrantRole}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Grant Role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
