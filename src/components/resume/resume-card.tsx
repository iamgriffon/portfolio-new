import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaExternalLinkAlt } from "react-icons/fa";
interface ResumeCardProps {
  id: number;
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string | null;
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
      className={`group border border-white rounded-lg overflow-hidden bg-slate-800/80 cursor-pointer relative z-30 ${
        isExpanded ? "shadow-lg shadow-green-400/20" : ""
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={() => onToggle(id)}
      layout
      whileHover={{
        borderColor: "#4ade80",
        boxShadow: isExpanded ? "0 0 20px rgba(74, 222, 128, 0.3)" : "none",
      }}
    >
      <motion.div 
        className="p-4 flex justify-between items-start"
        layout="position"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3">
            {image_url && (
              <img
                src={image_url}
                alt={title}
                className="w-8 h-8 object-contain"
              />
            )}
            <h3 className="text-xl font-bold group-hover:text-green-400 transition-colors duration-300 text-white">{title}</h3>
          </div>
          <p className="text-gray-300 mt-1">{subtitle}</p>
          <div className="text-sm text-gray-400 mt-1">
            {formatDate(startDate)} -{" "}
            {endDate ? formatDate(endDate) : "Present"}
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
        >
          <FaChevronDown className="group-hover:text-green-400 transition-colors duration-300 text-white text-lg" />
        </motion.div>
      </motion.div>

      {/* Card details */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key={`details-${id}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: 1, 
              height: "auto",
              transition: {
                height: {
                  duration: 0.4,
                  ease: [0.04, 0.62, 0.23, 0.98]
                },
                opacity: { 
                  duration: 0.25, 
                  delay: 0.1 
                }
              }
            }}
            exit={{ 
              opacity: 0, 
              height: 0,
              transition: {
                height: { 
                  duration: 0.3 
                },
                opacity: { 
                  duration: 0.2 
                }
              }
            }}
            className="px-4 overflow-hidden relative z-30"
            layout="position"
          >
            <motion.div 
              className="border-t border-gray-700 pt-3 mt-1 space-y-3 pb-4"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: 0.1
              }}
            >
              {details.map((detail, index) => (
                <motion.div 
                  key={index} 
                  className="mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      delay: 0.2 + (index * 0.05) 
                    }
                  }}
                >
                  {detail.label && (
                    <h4 className="text-green-400 font-bold mb-1">
                      {detail.label}
                    </h4>
                  )}

                  <p className="text-gray-300 text-sm font-mono">
                    {detail.content?.split(",").map((item, index) => (
                      <motion.span
                        key={index}
                        className="px-2 py-1 m-1 rounded-lg bg-slate-700/80 whitespace-normal break-normal inline-block"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1,
                          transition: { 
                            delay: 0.3 + (index * 0.03) 
                          }
                        }}
                      >
                        {item}
                      </motion.span>
                    ))}
                  </p>
                </motion.div>
              ))}

              {url && (
                <motion.a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center mt-3 text-sm text-green-400 hover:text-green-300 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    transition: { 
                      delay: 0.4 
                    }
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    x: 3,
                    transition: { duration: 0.2 }
                  }}
                >
                  {visitText} <FaExternalLinkAlt className="ml-1" />
                </motion.a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
