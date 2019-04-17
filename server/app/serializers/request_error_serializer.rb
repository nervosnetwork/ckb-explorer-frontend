class RequestErrorSerializer
  include FastJsonapi::ErrorSerializer

  attributes :title, :detail, :code, :status

  attribute :message do |err|
    err.title
  end
end
