import { useState } from "react";
import { useUserRole } from "../hooks/useUserRole";
import { useContractRead, useContractWrite } from "../hooks/useContracts";
import toast from "react-hot-toast";

function DeviceNFT() {
  const { isDevice, isConnected } = useUserRole();
  const [deviceId, setDeviceId] = useState("");
  const [dataType, setDataType] = useState("");
  const [location, setLocation] = useState("");
  const [additionalMetadata, setAdditionalMetadata] = useState("");

  const { data: templates } = useContractRead({
    contractName: "IoTDataFactory",
    functionName: "getAllTemplate",
    enabled: isConnected,
  });

  const { write: generateNFT, isPending } = useContractWrite({
    contractName: "IoTDataFactory",
    functionName: "generateDataNFT",
  });

  const handleGenerateNFT = () => {
    if (!deviceId || !dataType || !location || !additionalMetadata) {
      toast.error("Please fill in all fields");
      return;
    }

    const validTemplate = templates?.some(
      (t) => t.dataType.toLowerCase() === dataType.toLowerCase()
    );
    if (!validTemplate) {
      toast.error("Invalid data type. Choose from existing templates.");
      return;
    }

    const args = [
      deviceId,
      dataType.toLowerCase(),
      location,
      additionalMetadata,
    ];

    generateNFT(args, {
      onSuccess: (tx) => {
        console.log("Transaction successful:", tx);
        toast.success("NFT generated successfully");
        setDeviceId("");
        setDataType("");
        setLocation("");
        setAdditionalMetadata("");
      },
      onError: (err) => {
        console.error("Transaction error:", err);
        toast.error(`Error: ${err.message}`);
      },
    });
  };

  if (!isConnected) {
    return (
      <div className="text-center text-red-500 text-2xl pt-10">
        Please connect your wallet
      </div>
    );
  }

  if (!isDevice) {
    return (
      <div className="text-center text-red-500 text-2xl pt-10">
        Only devices can access this page
      </div>
    );
  }

  return (
    <div className="pt-10 max-w-3xl m-auto">
      <h1 className="text-2xl font-bold mb-4">Generate Data NFT</h1>

      <div className="flex flex-col gap-5 w-full">
        <input
          type="text"
          placeholder="Device ID"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          className="bg-gray-600 text-gray-100 p-2 border rounded"
        />

        <select
          value={dataType}
          onChange={(e) => setDataType(e.target.value)}
          className=" bg-gray-600 text-gray-100 p-2 border rounded"
        >
          <option value="">Select Data Type</option>
          {templates?.map((t) => (
            <option key={t.dataType} value={t.dataType}>
              {t.dataType}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-gray-600 text-gray-100 p-2 border rounded"
        />

        <textarea
          rows={5}
          type="text"
          placeholder="Data"
          value={additionalMetadata}
          onChange={(e) => setAdditionalMetadata(e.target.value)}
          className="bg-gray-600 text-gray-100 p-2 border rounded"
        />

        <button
          onClick={handleGenerateNFT}
          disabled={isPending}
          className={`p-2  rounded transition ${
            isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isPending ? "Generating..." : "Generate NFT"}
        </button>
      </div>
    </div>
  );
}

export default DeviceNFT;
