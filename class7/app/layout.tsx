import { React } from "next/dist/server/route-modules/app-page/vendored/rsc/entrypoints";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	)
}