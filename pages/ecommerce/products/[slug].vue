<script setup>
const pageTitle = ref('Product | YRL')

const config = useRuntimeConfig()
const { errorMsg, message, galleryMedia, mediaReference, showMediaSelector } = useAppState()
const { fetchAll, saveMedia, saveDoc, deleteDocs } = useHttp()
const route = useRoute()
const router = useRouter()

const quantitySelectors = ref([])

const showQuantitySelector = ref(false)
const listStyle = ref('tile')

let response = null
const product = ref({})
const relatedProducts = ref([])
const slug = route.params.slug === '_' ? null : route.params.slug

if (slug) {
	response = await fetchAll('products', { slug, populate: 'gallery oemPartNumber eligibilities nextHigherAssemblies' })
	console.log(response)
	if (response) {
		const nextHigherAssemblyIds = []
		product.value = response.docs[0]

		for (const prop in product.value.nextHigherAssemblies) {
			nextHigherAssemblyIds.push(product.value.nextHigherAssemblies[prop].id)
		}

		console.log('NN', nextHigherAssemblyIds)

		Promise.all(
			nextHigherAssemblyIds.map(async (nextHigherAssemblyId) => {
				const res = await fetchAll('products', { nextHigherAssemblies: nextHigherAssemblyId })
				console.log('R', res)
				if (res) {
					relatedProducts.value.push(...res.docs)
				}
				// console.log('RP', relatedProducts.value)

				// if (product.value.id) {
				// 	response = await fetchAll('variants', { product: product.value.id })
				// 	if (response.docs) product.value.variants = response.docs
				// }
			})
		)
	}
}

const getcartItemCount = () => {
	// if (cart.value.items && cart.value.items.length) {
	//   const found = cart.value.items.find((i) => i.product._id == props.product._id)
	//   return found ? found.quantity : 0
	// }
	return 'Add To Quote'
}

const saveProduct = async () => {
	console.log(product.value)
	if (!product.value.name) return (errorMsg.value = 'Product name is required')
	// const id = product.value.id ? product.value.id : null
	const newProduct = await saveDoc('products', product.value)
	console.log('newProduct', newProduct)
	if (!Object.values(newProduct).length) return
	// slug = newProduct.slug
	message.value = 'product saved succesfully'
	// response = await deleteDocs('variants', { product: newProduct.id })
	// if (!response) return
	// if (product.value.variants.length) response = await $saveDoc('variants', product.value.variants)
	router.push({
		name: 'admin-ecommerce-products-slug',
		params: { slug: newProduct.slug },
	})
	message.value = 'product saved succesfully'
	// response = await $fetchBySlug('products', slug)
	// if (response) product.value = response
}

// const showMediaUploader = () => {
//   mediaReference.value = 'productMedia'
//   showMediaSelector.value = true
// }

// Set category gallery
// const addImagesToGallery = async (media) => {
//   // console.log('mediap', media)
//   // console.log(product.value)
//   for (const prop in media) {
//     const index = product.value.gallery.findIndex((el) => el._id == media[prop]._id)
//     if (index === -1) {
//       product.value.gallery.push(media[prop])
//     }
//   }
//   // console.log(product.value.gallery)
// }

watch(
	() => galleryMedia.value,
	(currentVal) => {
		if (mediaReference.value === 'productMedia') product.value.gallery[0] = currentVal[0]
	},
	{ deep: true }
)
</script>

<template>
	<div class="flex-1 flex-row justify-center items-center border-red">
		<Title>{{ pageTitle }}</Title>
		<div class="w-996p">
			<header class="flex-col gap-2 w-full max-width-130">
				<div class="go-back" id="product-go-back">
					<NuxtLink class="admin-link" :to="{ name: 'admin-ecommerce-products' }">
						<IconsArrowWest /><span>Products</span>
					</NuxtLink>
				</div>
			</header>
			<main class="flex-1 flex-col gap-2">
				<div class="flex-row gap-4">
					<div class="image w-40 h-40 flex-row justify-center items-center">
						<img
							class="w-full h-full cover br-3"
							v-if="product.gallery.length && product.gallery[0] && product.gallery[0].mimetype.includes('image')"
							:src="`${config.backendUrl}/${product.gallery[0].path}`"
						/>
						<img v-else class="w-full h-full cover br-3" :src="`${config.backendUrl}/placeholder.png`" />
					</div>
					<div class="flex-1 shadow-md flex-col items-center gap-2">
						<div class="text-4xl tracking-wide">{{ product.name }}</div>
						<div class="text-xl tracking-wide">{{ product.oemPartNumber.name }}</div>
						<div class="text-md tracking-wide text-slate-400">{{ product.description }}</div>
						<div class="text-xl tracking-wide text-yellow-700">${{ product.price.toFixed(2) }}</div>
						<EcommerceQuantitySelector
							:product="product"
							:minVal="0"
							:maxVal="4"
							:stepVal="1"
							:btnText="getcartItemCount()"
							:showQuantitySelector="showQuantitySelector"
							@toggleQuantitySelectors="showQuantitySelector = !showQuantitySelector"
							@cancel="$emit('resetSelectQuantities')"
						/>
					</div>
				</div>
				<div class="flex-col gap-2">
					<div>
						<section class="shadow-md w-full bg-white p-2 br-5" id="general-info">
							<div class="flex-row items-center justify-between text-sm mb-1">
								<div class="uppercase inline-block border-b-stone-300 font-bold pb05">Eligibility</div>
								<div></div>
							</div>
							<div class="flex-row wrap gap-1">
								<div v-for="(eligibility, i) in product.eligibilities" :key="eligibility.id">
									<div
										class="flex-row gap-1 items-center text-xs text-slate-50 border border-slate-400 bg-slate-600 br-3"
									>
										<NuxtLink
											class=""
											:to="{ name: 'admin-ecommerce-products', query: { eligibilities: eligibility.id } }"
										>
											<span>{{ eligibility.name }}</span>
										</NuxtLink>
									</div>
								</div>
							</div>
						</section>
						<section class="shadow-md w-full bg-white p-2 br-5" id="general-info">
							<div class="flex-row items-center justify-between text-sm mb-1">
								<div class="uppercase inline-block border-b-stone-300 font-bold pb05">Next Higher Assembly</div>
								<div></div>
							</div>
							<div class="flex-row wrap gap-1">
								<div v-for="(nextHigherAssembly, i) in product.nextHigherAssemblies" :key="nextHigherAssembly.id">
									<div
										class="flex-row gap-1 items-center text-xs text-slate-50 border border-slate-400 bg-slate-600 br-3"
									>
										<NuxtLink
											class=""
											:to="{ name: 'admin-ecommerce-products', query: { nextHigherAssemblies: nextHigherAssembly.id } }"
										>
											<span>{{ nextHigherAssembly.name }}</span>
										</NuxtLink>
									</div>
								</div>
							</div>
						</section>
					</div>
				</div>
				<div>
					<div class="product-list" :class="{ list: listStyle == 'list', tile: listStyle == 'tile' }" ref="scrollRef">
						<EcommerceProductsCard
							v-for="(product, i) in relatedProducts"
							:key="product.id"
							:product="product"
							:listStyle="listStyle"
							:showQuantitySelector="quantitySelectors[i]"
							@toggleQuantitySelectors="toggleQuantitySelectors($event, i)"
							@resetSelectQuantities="resetSelectQuantities"
						/>
					</div>
				</div>
			</main>
		</div>

		<!-- <footer class="w-full max-width-130 bg-slate-300 px-2 py-1 br-5 flex-row justify-center text-2xl">Footer</footer> -->
	</div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.main {
	// display: grid;
	// grid-template-columns: 1fr 25rem;
	// gap: 2rem;
	// align-items: flex-start;

	// .left-sidebar {
	// 	position: sticky;
	// 	top: 10rem;
	// 	background-color: white;
	// 	border: 1px solid $slate-100;
	// 	border-radius: 3px;
	// 	padding: 2rem 0.5rem;
	// }

	// .right-sidebar {
	// 	position: sticky;
	// 	top: 10rem;
	// 	display: flex;
	// 	flex-direction: column;
	// 	gap: 2rem;
	// }
}

// .go-to-top {
//   position: sticky;
//   bottom: 4rem;
// }
</style>
