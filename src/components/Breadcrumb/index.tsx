import formatBreadcrumb from "@/utils/formatBreadcrumb";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import clsx from "clsx";
import { IconType } from "react-icons/lib";
import { useLocation, useParams } from "react-router-dom";

function BreadcrumbWithCustomSeparator( { icon: Icon }: {icon: IconType} ) {
  const { pathname } = useLocation();

  const { id } = useParams();

  const breadcrumbs = [];

  if (pathname && !pathname.includes("beranda")) {

    if(id) {
      const dataPath = pathname.split("/");
      dataPath.pop();
      breadcrumbs.push(...formatBreadcrumb(dataPath.join('/')));
    } else breadcrumbs.push(...formatBreadcrumb(pathname));
  }

  const pathSplit = pathname.split('/');

  const linkFormat = ( index: number ) => {
    if (index <= pathSplit.length) {
      if(index === 0) {
        return `/${pathSplit.slice(1, 3).join('/')}`;
      } else {
        return `/${pathSplit.slice(1, index + 2).join('/')}`;
      }
    } else {
      return '#';
    }
  }

  return (
    <section className="flex items-center gap-4">
      <div className="bg-white p-2 shadow-md rounded">
        <Icon className="text-primary w-8 h-8" />
      </div>
      <Breadcrumbs
        separator={<span className="text-primary font-medium lg:text-base md:text-sm text-xs">/</span>}
      >
        {breadcrumbs.map((item, i) => (
          <BreadcrumbItem
            key={i}
            className="font-medium"
            classNames={{
              item: clsx("lg:text-lg md:text-base text-xs", {
                "text-primary": i === breadcrumbs.length - 1,
                "text-primary/50": i < breadcrumbs.length - 1,
              }),
            }}
            href={linkFormat(i)}
          >
            {item === ' Cms' ? 'CMS' : item}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
    </section>
  );
}

export default BreadcrumbWithCustomSeparator;
