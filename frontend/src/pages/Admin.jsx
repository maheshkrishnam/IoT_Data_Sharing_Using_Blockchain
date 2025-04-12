import { useState } from "react";
import { useUserRole } from "../hooks/useUserRole";
import { useContractRead, useContractWrite } from "../hooks/useContracts";
import toast from "react-hot-toast";

function Admin() {
  const { role, isConnected } = useUserRole();
  const [deviceAddress, setDeviceAddress] = useState("");
  const [verifierAddress, setVerifierAddress] = useState("");

  const { data: devices } = useContractRead({
    contractName: "IoTDataAccessControl",
    functionName: "getAllDevices",
    enabled: role === "admin",
  });

  const { data: verifiers } = useContractRead({
    contractName: "IoTDataAccessControl",
    functionName: "getAllVerifiers",
    enabled: role === "admin",
  });

  const { write: grantDevice } = useContractWrite({
    contractName: "IoTDataAccessControl",
    functionName: "grantDeviceRole",
  });

  const { write: grantVerifier } = useContractWrite({
    contractName: "IoTDataAccessControl",
    functionName: "grantVerifierRole",
  });

  const { write: revokeDevice } = useContractWrite({
    contractName: "IoTDataAccessControl",
    functionName: "revokeDeviceRole",
  });

  const { write: revokeVerifier } = useContractWrite({
    contractName: "IoTDataAccessControl",
    functionName: "revokeVerifierRole",
  });

  const handleGrantDevice = () => {
    if (!deviceAddress) {
      toast.error("Please enter a device address");
      return;
    }
    grantDevice([deviceAddress], {
      onSuccess: () => toast.success("Device role granted"),
      onError: (error) => toast.error(`Error: ${error.message}`),
    });
    setDeviceAddress("");
  };

  const handleGrantVerifier = () => {
    if (!verifierAddress) {
      toast.error("Please enter a verifier address");
      return;
    }
    grantVerifier([verifierAddress], {
      onSuccess: () => toast.success("Verifier role granted"),
      onError: (error) => toast.error(`Error: ${error.message}`),
    });
    setVerifierAddress("");
  };

  const handleRevokeDevice = () => {
    if (!deviceAddress) {
      toast.error("Please enter a device address");
      return;
    }
    revokeDevice([deviceAddress], {
      onSuccess: () => toast.success("Device role revoked"),
      onError: (error) => toast.error(`Error: ${error.message}`),
    });
    setDeviceAddress("");
  };

  const handleRevokeVerifier = () => {
    if (!verifierAddress) {
      toast.error("Please enter a verifier address");
      return;
    }
    revokeVerifier([verifierAddress], {
      onSuccess: () => toast.success("Verifier role revoked"),
      onError: (error) => toast.error(`Error: ${error.message}`),
    });
    setVerifierAddress("");
  };

  if (!isConnected) {
    <div className="text-center text-red-500 text-2xl pt-10">
      Please connect your wallet
    </div>;
  }

  if (role !== "admin") {
    return (
      <div className="text-center text-red-500 text-2xl pt-10">
        You are not authorized to access this page
      </div>
    );
  }

  return (
    <div className="pt-10 max-w-3xl mx-auto text-gray">
      <h1 className="text-2xl font-semibold mb-4 text-gray-500">Admin Panel</h1>

      <div className="mb-6">
        <h2 className="text-xl font-medium mb-2 text-gray-500">Device Role</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter device address"
            value={deviceAddress}
            onChange={(e) => setDeviceAddress(e.target.value)}
            className="bg-gray-600 text-gray-100 w-full p-2 border rounded"
          />
          <button
            onClick={handleGrantDevice}
            className="px-4 py-2 bg-blue-500  rounded hover:bg-blue-600"
          >
            Grant
          </button>
          <button
            onClick={handleRevokeDevice}
            className="px-4 py-2 bg-red-500  rounded hover:bg-red-600"
          >
            Revoke
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-medium mb-2 text-gray-500">
          Verifier Role
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter verifier address"
            value={verifierAddress}
            onChange={(e) => setVerifierAddress(e.target.value)}
            className="bg-gray-600 text-gray-100 w-full p-2 border rounded"
          />
          <button
            onClick={handleGrantVerifier}
            className="px-4 py-2 bg-green-500  rounded hover:bg-green-600"
          >
            Grant
          </button>
          <button
            onClick={handleRevokeVerifier}
            className="px-4 py-2 bg-red-500  rounded hover:bg-red-600"
          >
            Revoke
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-medium mb-2 text-gray-500">
          Registered Devices
        </h2>
        <div className="bg-gray-900 p-3 rounded">
          {devices?.length ? (
            devices.map((addr, index) => (
              <div key={index} className="p-2 border-b last:border-0">
                {addr}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No devices registered</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-medium mb-2 text-gray-500">
          Registered Verifiers
        </h2>
        <div className="bg-gray-900 p-3 rounded">
          {verifiers?.length ? (
            verifiers.map((addr, index) => (
              <div key={index} className="p-2 border-b last:border-0">
                {addr}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No verifiers registered</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;
