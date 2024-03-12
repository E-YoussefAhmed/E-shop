import axios from "axios";
import { createHash } from "crypto";
import { AiFillPhone, AiOutlineDesktop, AiOutlineLaptop } from "react-icons/ai";
import { MdOutlineKeyboard, MdStorefront, MdTv, MdWatch } from "react-icons/md";

export const truncateText = (str: string) => {
  if (str.length < 25) return str;

  return str.substring(0, 25) + "...";
};

export const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatNumber = (digit: number) => {
  return new Intl.NumberFormat("en-Us").format(digit);
};

export const categories = [
  {
    label: "All",
    icon: MdStorefront,
  },
  {
    label: "Phone",
    icon: AiFillPhone,
  },
  {
    label: "Laptop",
    icon: AiOutlineLaptop,
  },
  {
    label: "Desktop",
    icon: AiOutlineDesktop,
  },
  {
    label: "Watch",
    icon: MdWatch,
  },
  {
    label: "Tv",
    icon: MdTv,
  },
  {
    label: "Accessories",
    icon: MdOutlineKeyboard,
  },
];

export const colors = [
  {
    color: "White",
    colorCode: "#FFFFFF",
    image: null,
  },
  {
    color: "Black",
    colorCode: "#000000",
    image: null,
  },
  {
    color: "Silver",
    colorCode: "#C0C0C0",
    image: null,
  },
  {
    color: "Gray",
    colorCode: "#808080",
    image: null,
  },
  {
    color: "Red",
    colorCode: "#FF0000",
    image: null,
  },
  {
    color: "Gold",
    colorCode: "#FFD700",
    image: null,
  },
  {
    color: "Blue",
    colorCode: "#0000FF",
    image: null,
  },
  {
    color: "Graphite",
    colorCode: "#383838",
    image: null,
  },
];

export const uploadCloudinary = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "q9zjmych");
    const { data } = await axios.post(
      "https://api.cloudinary.com/v1_1/dfixhsycs/image/upload",
      formData
    );
    return data?.secure_url;
  } catch (error) {
    console.log(error);
  }
};

const generateSHA1 = (data: any) => {
  const hash = createHash("sha1");
  hash.update(data);
  return hash.digest("hex");
};

const generateSignature = (publicId: string, apiSecret: string) => {
  const timestamp = new Date().getTime();
  return `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
};

export const deleteCloudinary = async (publicId: string) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
  const apiKey = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  const timestamp = new Date().getTime();
  const signature = generateSHA1(generateSignature(publicId, apiSecret));
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

  try {
    const response = await axios.post(url, {
      public_id: publicId,
      signature,
      api_key: apiKey,
      timestamp,
    });

    console.error(response);
  } catch (error) {
    console.error(error);
  }
};

export const getPublicIdFromUrl = (url: string) => {
  const regex = /\/v\d+\/([^/]+)\.\w{3,4}$/;

  const match = url.match(regex);
  return match ? match[1] : null;
};
