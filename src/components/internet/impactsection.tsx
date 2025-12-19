"use client";

import React from "react";

export const ImpactSection = () => {
    return (
        <section className="bg-[#fffcf4] py-24">
            <div className="max-w-7xl mx-auto px-6">
                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* LEFT */}
                    <div className="space-y-20">
                        {/* Block 1 */}
                        <div className="border-t border-[#6c5f31]/30 pt-10">
                            <h2 className="text-3xl font-medium text-[#6c5f31] mb-4">
                                Impact you can prove
                            </h2>

                            <p className="text-[#4b5563] text-lg leading-relaxed max-w-xl">
                               Lorem, ipsum dolor sit amet consectetur adipisicing elit. Provident atque nobis tempora error dolores, sed quidem, magnam facilis, esse hic placeat id pariatur quam asperiores neque impedit inventore optio quo est vel repudiandae accusantium iste corporis! Illum velit est, cupiditate iure inventore quis soluta reprehenderit quas nisi, veritatis fuga delectus.
                            </p>

                          
                        </div>
                        {/* Block 2 */}
                        <div className="border-t border-[#6c5f31]/30 pt-10">
                            <h2 className="text-3xl font-medium text-[#6c5f31] mb-4">
                                Numbers you can trust
                            </h2>

                            <p className="text-[#4b5563] text-lg leading-relaxed max-w-xl">
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nostrum, deleniti porro odio voluptates omnis aperiam doloribus unde perferendis vitae possimus libero sed repellat. Ut suscipit vero distinctio eligendi dignissimos reprehenderit voluptates recusandae dolorum autem hic ratione, possimus quam aspernatur animi tempore. Optio explicabo deserunt quam voluptatibus reiciendis soluta. Ipsam, id.
                            </p>
                      
                        </div>
                    </div>

                    {/* RIGHT */}

                    <div className="space-y-10">
                        <h1 className="text-3xl leading-tight font-bold text-right text-[#6c5f31]">
                            Lorem, ipsum dolor.
                            <br />
                            Lorem ipsum dolor sit.
                        </h1>

                        {/* Visual */}
                        <div className="relative w-full max-w-md">
                            <video
                                src="/internet/impact.mp4"
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full "
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
