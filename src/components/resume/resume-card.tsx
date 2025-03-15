import { motion } from "framer-motion";
import { FaChevronDown, FaExternalLinkAlt } from "react-icons/fa";
interface ResumeCardProps {
  id: number;
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string | null;
  description: string;
  details: Array<{ label: string; content: string | null }>;
  url: string | null;
  isExpanded: boolean;
  onToggle: (id: number) => void;
  visitText: string;
  image_url: string | null;
}

export function ResumeCard({
  id,
  title,
  subtitle,
  startDate,
  endDate,
  description,
  details,
  url,
  isExpanded,
  onToggle,
  visitText,
  image_url,
}: ResumeCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Present";

    const [year, month] = dateString.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <motion.div
      className={`border border-white rounded-lg overflow-hidden bg-slate-800/80 cursor-pointer ${
        isExpanded ? "shadow-lg shadow-green-400/20" : ""
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={() => onToggle(id)}
      whileHover={{
        scale: isExpanded ? 1 : 1.02,
        borderColor: "#4ade80",
      }}
    >
      <div className="p-5">
        <div className="flex justify-between items-center">
          <div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <h3 className="text-xl font-bold text-white py-2">{description}</h3>
            <p className="flex items-center gap-4">
              <span className="text-green-400">{subtitle}</span>
              {image_url && (
                <img
                  src={image_url}
                  alt={title}
                  className="w-10 h-10 rounded-full"
                  width={40}
                  height={40}
                />
              )}
            </p>
          </div>
          <div className="text-right">
            <div className="text-gray-400 font-mono text-sm">
              {formatDate(startDate)} - {formatDate(endDate)}
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              className="flex justify-end mt-2"
            >
              <FaChevronDown className="text-green-400" />
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isExpanded ? "auto" : 0,
            opacity: isExpanded ? 1 : 0,
          }}
          className="overflow-hidden mt-4"
        >
          {details.map(
            (detail, idx) =>
              detail.content && (
                <div key={idx} className="mb-4">
                  <h4 className="text-green-400 font-bold mb-1">
                    {detail.label}:
                  </h4>
                  <p className="text-gray-300">
                    {detail.content.split(",").map((item, i) => (
                      <span
                        key={i}
                        className="inline-block bg-slate-700 rounded-full px-3 py-1 text-sm font-mono text-gray-200 mr-2 mb-2"
                      >
                        {item.trim().replace("and", "")}
                      </span>
                    ))}
                  </p>
                </div>
              )
          )}

          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-green-400 hover:text-green-300 mt-2"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="mr-2">{visitText}</span>
              <FaExternalLinkAlt size={12} />
            </a>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
