"use client";
export default function Component() {
  return (
    <div className="w-full pb-5">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[40%,55%]">
        <div>
          <img
            src="https://th.bing.com/th/id/OIP.tw-cH024cHORVIVEMH1iGwHaE8?w=6000&h=4000&rs=1&pid=ImgDetMain"
            width={600}
            height={400}
            alt="Boat"
            className="w-full rounded-lg object-cover"
          />
          <div className="mt-4 grid grid-cols-3 gap-4">
            <img
              src="https://th.bing.com/th/id/OIP.tw-cH024cHORVIVEMH1iGwHaE8?w=6000&h=4000&rs=1&pid=ImgDetMain"
              width={150}
              height={100}
              alt="Additional Image"
              className="h-24 w-full rounded-lg object-cover"
            />
            <img
              src="https://th.bing.com/th/id/OIP.tw-cH024cHORVIVEMH1iGwHaE8?w=6000&h=4000&rs=1&pid=ImgDetMain"
              width={150}
              height={100}
              alt="Additional Image"
              className="h-24 w-full rounded-lg object-cover"
            />
            <img
              src="https://th.bing.com/th/id/OIP.tw-cH024cHORVIVEMH1iGwHaE8?w=6000&h=4000&rs=1&pid=ImgDetMain"
              width={150}
              height={100}
              alt="Additional Image"
              className="h-24 w-full rounded-lg object-cover"
            />
          </div>
        </div>
        <div>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="mb-4 text-2xl font-bold">Boat Details</h3>
              <div>
                <div className="flex flex-col">
                  <span className="font-semibold">Boat Make:</span>
                  <span>Acme Sailboats</span>
                </div>
              </div>
              <div>
                <div className="flex flex-col">
                  <span className="font-semibold">Boat Model:</span>
                  <span>Seabreeze 350</span>
                </div>
              </div>
              <div>
                <div className="flex flex-col">
                  <span className="font-semibold">Registration Number:</span>
                  <span>ABC123</span>
                </div>
              </div>
              <div>
                <div className="flex flex-col">
                  <span className="font-semibold">Year:</span>
                  <span>2020</span>
                </div>
              </div>
              <div>
                <div className="flex flex-col">
                  <span className="font-semibold">Length:</span>
                  <span>35 ft</span>
                </div>
              </div>
              <div>
                <div className="flex flex-col">
                  <span className="font-semibold">Additional Notes:</span>
                  <span>Well-maintained, recently serviced</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-2xl font-bold">Owner Details</h3>
              <div>
                <div className="flex flex-col">
                  <span className="font-semibold">Owner Name:</span>
                  <span>John Doe</span>
                </div>
              </div>
              <div>
                <div className="flex flex-col">
                  <span className="font-semibold">Phone:</span>
                  <span>555-1234</span>
                </div>
              </div>
              <div>
                <div className="flex flex-col">
                  <span className="font-semibold">Email:</span>
                  <span>john@example.com</span>
                </div>
              </div>
              <div>
                <div className="flex flex-col">
                  <span className="font-semibold">Address:</span>
                  <span>123 Main St, Anytown USA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
