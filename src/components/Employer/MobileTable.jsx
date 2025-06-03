import { Card, CardContent } from "@/components/ui/card"

const products = [
  {
    id: "RT15246630",
    name: "Shoes High Heels...",
    price: 65.0,
    orders: 1,
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "RT15246680",
    name: "Chromiums Bagi...",
    price: 50.0,
    orders: 2,
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "RT15246850",
    name: "Rose Gold Ring w...",
    price: 55.0,
    orders: 3,
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "RT15249630",
    name: "Lightup Nails Bea...",
    price: 48.0,
    orders: 3,
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "RT15246745",
    name: "Yellow Fruit Bottle",
    price: 63.0,
    orders: 1,
    image: "/placeholder.svg?height=60&width=60",
  },
]

export default function MobileTable() {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* This table only shows on small screens and hides on medium screens and up */}
      <div className="sm:hidden">
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {products.map((product, index) => (
                <div key={product.id} className="flex items-center p-4 gap-3">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-500">ID: {product.id}</p>
                  </div>

                  {/* Price and Orders */}
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">$ {product.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{product.orders} Orders</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Message for larger screens */}
      <div className="hidden sm:block text-center p-8 text-gray-500">
        <p>This table is only visible on small screens (mobile devices).</p>
        <p className="text-sm mt-2">Resize your browser window to see the mobile view.</p>
      </div>
    </div>
  )
}
