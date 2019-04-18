module FastJsonapi
  class PaginationMetaGenerator
    DEFAULT_PAGE = 1
    DEFAULT_PER_PAGE = 20

    def initialize(request:, records:, page:, page_size:)
      @url = request.base_url + request.path
      @page = page.to_i
      @page_size = page_size.to_i
      @total_pages = records.total_pages
      @records = records
      @hash = { links: {}, meta: { total: records.total_count } }
    end

    def call
      if page > 1
        hash[:links][:first] = generate_url(1)
        hash[:links][:prev] = generate_url(records.prev_page)
      end

      hash[:links][:self] = generate_url(page)

      if page < total_pages
        hash[:links][:next] = generate_url(records.next_page)
        hash[:links][:last] = generate_url(records.total_pages)
      end

      hash
    end

    private

    attr_reader :page, :page_size, :records, :total_pages
    attr_accessor :url, :hash

    def generate_url(page)
      [url, url_params(page)].join("?")
    end

    def url_params(page)
      url_params = {}
      url_params[:page_size] = page_size if include_per_page?
      url_params[:page] = page if include_page?(page)
      url_params.to_query
    end

    def include_per_page?
      (page_size != 0) && (page_size != DEFAULT_PER_PAGE)
    end

    def include_page?(page)
      (page != 0) && (page != DEFAULT_PAGE)
    end
  end
end
