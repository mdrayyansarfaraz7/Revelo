import Image from "next/image";
import { ArrowRight } from "lucide-react";

const popularCategories = [
    {
        title: "Dance",
        image: "/Dance.png",
    },
    {
        title: "Music",
        image: "/Music.png",
    },
    {
        title: "Hackathons",
        image: "/Tech.png",
    },
    {
        title: "Art",
        image: "/Art.png",
    },
    {
        title: "Sports",
        image: "/sports.png",
    },
    {
        title: "Potography",
        image: "/Photography.png",
    }
];

function Category() {
    return (
        <div className="px-4 py-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-white text-3xl font-semibold">Popular Categories</h2>
                <button className="flex items-center gap-1 text-white transition-colors cursor-pointer">
                    See all
                    <ArrowRight size={16} className="mt-[1px] transition-transform group-hover:translate-x-1 text-purple-500 text-sm font-medium hover:text-purple-600" />
                </button>
            </div>
            <div className="flex gap-8 px-5 overflow-x-auto">
                {popularCategories.map((cat, index) => (
                    <div key={index} className="min-w-[150px]">
                        <div className="rounded-md overflow-hidden shadow-md">
                            <Image
                                src={cat.image}
                                alt={cat.title}
                                width={200}
                                height={400}
                                className="object-cover"
                            />
                        </div>
                        <p className="text-white text-sm mt-2">{cat.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Category;
